/**
 * copy from https://github.com/YMFE/yapi
 */
import _ from 'lodash';
import type { ColumnsType } from 'antd/es/table';
import { Table } from 'antd';

let fieldNum = 1;

const messageMap = {
  desc: '备注',
  default: '实例',
  maximum: '最大值',
  minimum: '最小值',
  maxItems: '最大数量',
  minItems: '最小数量',
  maxLength: '最大长度',
  minLength: '最小长度',
  enum: '枚举',
  enumDesc: '枚举备注',
  uniqueItems: '元素是否都不同',
  itemType: 'item 类型',
  format: 'format',
  itemFormat: 'format',
  mock: 'mock',
};

const columns: ColumnsType<any> = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 100,
    render: (text, item) => {
      // console.log('text',item.sub);
      return text === 'array' ? (
        <span>{item.sub ? item.sub.itemType || '' : 'array'} []</span>
      ) : (
        <span>{text}</span>
      );
    },
  },
  {
    title: '是否必须',
    dataIndex: 'required',
    key: 'required',
    width: 80,
    render: (required) => (required ? '是' : '否'),
  },
  {
    title: '默认值',
    dataIndex: 'default',
    key: 'default',
    render: (text) => {
      return <div>{_.isBoolean(text) ? text + '' : text}</div>;
    },
  },
  {
    title: '备注',
    dataIndex: 'desc',
    key: 'desc',
    render: (text, item) => {
      return _.isUndefined(item.childrenDesc) ? (
        <span>{text}</span>
      ) : (
        <span>{item.childrenDesc}</span>
      );
    },
  },
  {
    title: '其他信息',
    dataIndex: 'sub',
    key: 'sub',
    render: (text, record) => {
      const result = text || record;

      return Object.keys(result).map((item, index) => {
        const name = messageMap[item];
        const value = result[item];
        const isShow = !_.isUndefined(result[item]) && result[item] && !_.isUndefined(name) && name;
        const key = `${name}${index}`;

        return (
          isShow && (
            <p key={key}>
              <span style={{ fontWeight: 700 }}>{name}: </span>
              <span>{value?.toString()}</span>
            </p>
          )
        );
      });
    },
  },
];

//  自动添加type

function checkJsonSchema(json: { description: any; type: any; properties: any }) {
  const newJson = Object.assign({}, json);
  if (_.isUndefined(json.type) && _.isObject(json.properties)) {
    newJson.type = 'object';
  }

  return newJson;
}

// @ts-ignore
const Schema = (data, key) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const result = mapping(data, key);
  if (data.type !== 'object') {
    const desc = result.desc;
    const d = result.default;
    const children = result.children;

    delete result.desc;
    delete result.default;
    delete result.children;
    let item = {
      type: data.type,
      key,
      desc,
      default: d,
      sub: result,
    };

    if (_.isArray(children)) {
      item = Object.assign({}, item, { children });
    }

    return item;
  }

  return result;
};

const SchemaObject = (data: { properties: any; required: any }, key: string) => {
  let { properties, required } = data;
  properties = properties || {};
  required = required || [];
  const result: { name: string; key: string; desc: any; required: boolean }[] = [];
  Object.keys(properties).map((name, index) => {
    const value = properties[name];
    const copiedState = checkJsonSchema(JSON.parse(JSON.stringify(value)));

    const optionForm = Schema(copiedState, key + '-' + index);
    let item = {
      name,
      key: key + '-' + index,
      desc: copiedState.description,
      required: required.indexOf(name) != -1,
      sub: undefined,
    };

    if (value.type === 'object' || (_.isUndefined(value.type) && _.isArray(optionForm))) {
      item = Object.assign({}, item, { type: 'object', children: optionForm });
      delete item.sub;
    } else {
      item = Object.assign({}, item, optionForm);
    }

    result.push(item);
  });

  return result;
};

const SchemaString = (data: {
  description: any;
  default: any;
  maxLength: any;
  minLength: any;
  enum: any;
  enumDesc: any;
  format: any;
  mock: { mock: any };
}) => {
  return {
    desc: data.description,
    default: data.default,
    maxLength: data.maxLength,
    minLength: data.minLength,
    enum: data.enum,
    enumDesc: data.enumDesc,
    format: data.format,
    mock: data.mock && data.mock.mock,
  };
};

// @ts-ignore
const SchemaArray = (
  data: {
    items: { type: any; description?: any; properties?: any };
    description: any;
    default: any;
    minItems: any;
    uniqueItems: any;
    maxItems: any;
  },
  index: any,
) => {
  data.items = data.items || { type: 'string' };
  // @ts-ignore
  const items = checkJsonSchema(data.items);
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const optionForm = mapping(items, index);
  //  处理array嵌套array的问题
  // @ts-ignore
  let children = optionForm;
  if (!_.isArray(optionForm) && !_.isUndefined(optionForm)) {
    optionForm.key = 'array-' + fieldNum++;
    children = [optionForm];
  }

  // @ts-ignore
  let item = {
    desc: data.description,
    default: data.default,
    minItems: data.minItems,
    uniqueItems: data.uniqueItems,
    maxItems: data.maxItems,
    itemType: items.type,
    children,
  };
  if (items.type === 'string') {
    // @ts-ignore
    item = Object.assign({}, item, { itemFormat: items.format });
  }
  return item;
};

const SchemaNumber = (data: {
  description: any;
  maximum: any;
  minimum: any;
  default: any;
  format: any;
  enum: any;
  enumDesc: any;
  mock: { mock: any };
}) => {
  return {
    desc: data.description,
    maximum: data.maximum,
    minimum: data.minimum,
    default: data.default,
    format: data.format,
    enum: data.enum,
    enumDesc: data.enumDesc,
    mock: data.mock && data.mock.mock,
  };
};

const SchemaInt = (data: {
  description: any;
  maximum: any;
  minimum: any;
  default: any;
  format: any;
  enum: any;
  enumDesc: any;
  mock: { mock: any };
}) => {
  return {
    desc: data.description,
    maximum: data.maximum,
    minimum: data.minimum,
    default: data.default,
    format: data.format,
    enum: data.enum,
    enumDesc: data.enumDesc,
    mock: data.mock && data.mock.mock,
  };
};

const SchemaBoolean = (data: {
  description: any;
  default: any;
  enum: any;
  mock: { mock: any };
}) => {
  return {
    desc: data.description,
    default: data.default,
    enum: data.enum,
    mock: data.mock && data.mock.mock,
  };
};

const SchemaOther = (data: { description: any; default: any; mock: { mock: any } }) => {
  return {
    desc: data.description,
    default: data.default,
    mock: data.mock && data.mock.mock,
  };
};

// @ts-ignore
const mapping = function (
  data: {
    description?: any;
    type?: any;
    properties?: any;
    default?: any;
    maxLength?: any;
    minLength?: any;
    enum?: any;
    enumDesc?: any;
    format?: any;
    mock?: { mock: any };
    maximum?: any;
    minimum?: any;
    items?: { type: any; description?: any; properties?: any };
    minItems?: any;
    uniqueItems?: any;
    maxItems?: any;
    required?: any;
  },
  index: string,
) {
  switch (data.type) {
    case 'string':
      // @ts-ignore
      return SchemaString(data);

    case 'number':
      // @ts-ignore
      return SchemaNumber(data);

    case 'array':
      // @ts-ignore
      return SchemaArray(data, index);

    case 'object':
      // @ts-ignore
      return SchemaObject(data, index);

    case 'boolean':
      // @ts-ignore
      return SchemaBoolean(data);

    case 'integer':
      // @ts-ignore
      return SchemaInt(data);
    default:
      // @ts-ignore
      return SchemaOther(data);
  }
};

// @ts-ignore
const schemaTransformToTable = (schema) => {
  try {
    // eslint-disable-next-line no-param-reassign
    schema = checkJsonSchema(schema);
    let result = Schema(schema, 0);
    result = _.isArray(result) ? result : [result];
    return result;
  } catch (err) {
    console.log(err);
  }
};

interface SchemaTableProp {
  dataSource: any;
}

export function SchemaTable(props: SchemaTableProp) {
  let product;
  try {
    product = props.dataSource;
  } catch (e) {
    product = null;
  }
  if (!product) {
    return null;
  }
  let data = schemaTransformToTable(product);
  data = _.isArray(data) ? data : [];
  return <Table bordered size="small" pagination={false} dataSource={data} columns={columns} />;
}
