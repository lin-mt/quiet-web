import { useState } from 'react';
import { handleSchema } from '@/pages/components/JsonSchemaEditor/utils';
import _ from 'lodash';
import { getDefaultSchema } from '@/pages/components/JsonSchemaEditor/constants';

let fieldNum = 0;

interface SchemaProp {
  title?: string;
  type: string;
  properties?: Record<string, SchemaProp>;
  required?: string[];
  description?: string;
  default?: boolean | string;
  mock?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  enum?: string[] | number[];
  enumDesc?: string;
  format?: string;
  exclusiveMinimum?: boolean;
  exclusiveMaximum?: boolean;
  items?: SchemaProp;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
}

export default () => {
  const [schema, setSchema] = useState<SchemaProp>({
    type: 'object',
    properties: {},
    required: [],
  });

  const [open, setOpen] = useState({
    properties: true,
  });

  const getParentKey = (keys: string[]): string[] => {
    if (!keys) {
      return [];
    }
    return keys.length === 1 ? [] : _.dropRight(keys, 1);
  };

  const addRequiredFields = (state: SchemaProp, keys: string[], fieldName: string) => {
    const parentKeys: string[] = getParentKey(keys); // parent
    const parentData = parentKeys.length ? _.get(state, parentKeys) : state;
    const requiredData: string[] = [].concat(parentData.required || []);
    requiredData.push(fieldName);
    parentKeys.push('required');
    return _.set(state, parentKeys, _.uniq(requiredData));
  };

  const changeEditorSchema = ({ value }: { value: any }) => {
    setSchema((prevState) => {
      const newVal = handleSchema(value);
      return { ...prevState, ...newVal };
    });
  };

  const removeRequireField = (state: SchemaProp, keys: string[], fieldName: string) => {
    const parentKeys: string[] = getParentKey(keys); // parent
    const parentData = parentKeys.length ? _.get(state, parentKeys) : state;
    const requiredData = [].concat(parentData.required || []);
    const filteredRequire = requiredData.filter((i) => i !== fieldName);
    parentKeys.push('required');
    return _.set(state, parentKeys, _.uniq(filteredRequire));
  };

  const changeName = ({ keys, name, value }: { keys: string[]; name: string; value: string }) => {
    setSchema((prevState) => {
      const clonedState = _.cloneDeep(prevState);
      const items = _.get(clonedState, keys);
      const keyExists = Object.keys(items).indexOf(value) >= 0 && items[value] === 'object';
      if (keyExists || !_.has(items, name)) {
        return prevState;
      }
      items[value] = items[name];
      delete items[name];
      const newState = addRequiredFields(clonedState, keys, value);
      return removeRequireField(newState, keys, name);
    });
  };

  const handleDelete = (state: SchemaProp, { keys }: { keys: string[] }) => {
    const clonedState = _.clone(state);
    _.unset(clonedState, keys);
    return clonedState;
  };

  const changeValue = ({ keys, value }: { keys: string[]; value: any }) => {
    setSchema((prevState) => {
      const newSchema = _.cloneDeep(prevState);
      if (value) {
        _.set(newSchema, keys, value);
        return newSchema;
      }
      return handleDelete(newSchema, { keys });
    });
  };

  const changeType = ({ keys, value }: { keys: string[]; value: string }) => {
    setSchema((prevState) => {
      const parentKeys: string[] = getParentKey(keys);
      const parentData = parentKeys.length ? _.get(prevState, parentKeys) : prevState;
      const clonedState = _.cloneDeep(prevState);
      if (parentData.type === value) {
        return clonedState;
      }
      const description = parentData.description ? { description: parentData.description } : {};
      const newParentDataItem = { ...getDefaultSchema(value), ...description };
      if (parentKeys.length === 0) {
        return { ...newParentDataItem };
      }
      return _.set(clonedState, parentKeys, newParentDataItem);
    });
  };

  const enableRequire = ({
    keys,
    name,
    required,
  }: {
    keys: string[];
    name: string;
    required: boolean;
  }) => {
    setSchema((prevState) => {
      const parentKeys: string[] = getParentKey(keys);
      const clonedState = _.cloneDeep(prevState);
      const parentData = parentKeys.length ? _.get(prevState, parentKeys) : prevState;
      const requiredArray: string[] = [].concat(parentData.required || []);
      const requiredFieldIndex = requiredArray.indexOf(name);
      const foundRequired = requiredFieldIndex >= 0;
      if (!required && foundRequired) {
        // Remove from required arr
        requiredArray.splice(requiredFieldIndex, 1);
      } else if (required && !foundRequired) {
        // Add to required arr
        requiredArray.push(name);
      }
      parentKeys.push('required');
      return _.set(clonedState, parentKeys, requiredArray);
    });
  };

  const handleSchemaRequired = (schemaChange: SchemaProp, checked: boolean): any => {
    const datum = schemaChange;
    if (datum.type === 'object') {
      const requiredTitle = getFieldsTitle(datum.properties);
      if (checked) {
        datum.required = requiredTitle;
      } else {
        delete datum.required;
      }
      if (datum.properties) {
        handleObject(datum.properties, checked);
        return null;
      }
    } else if (datum.type === 'array') {
      if (datum.items) {
        return handleSchemaRequired(datum.items, checked);
      }
    } else {
      return schema;
    }
    return null;
  };

  const requireAll = (required: boolean) => {
    setSchema((prevState) => {
      const data = _.cloneDeep(prevState);
      handleSchemaRequired(data, required);
      return { ...data };
    });
  };

  const deleteItem = ({ keys }: { keys: string[] }) => {
    setSchema((prevState) => {
      const clonedState = _.clone(prevState);
      _.unset(clonedState, keys);
      return clonedState;
    });
  };

  const addField = ({ keys, name }: { keys: string[]; name: string }) => {
    setSchema((prevState) => {
      fieldNum += 1;
      const clonedState = _.cloneDeep(prevState);
      const propertiesData = _.get(prevState, keys);
      let newPropertiesData: Record<string, any> = {};
      const fieldName = `field_${fieldNum}`;

      if (name) {
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const i in propertiesData) {
          newPropertiesData[i] = propertiesData[i];
          if (i === name) {
            newPropertiesData[fieldName] = getDefaultSchema('string');
          }
        }
      } else {
        newPropertiesData = _.assign(propertiesData, {
          [fieldName]: getDefaultSchema('string'),
        });
      }

      const newState = _.update(clonedState, keys, (n) => _.assign(n, newPropertiesData));
      return addRequiredFields(newState, keys, fieldName);
    });
  };

  const handleAddChildField = (state: SchemaProp, keys: string[], fieldName: string) => {
    const currentField = _.get(state, keys);
    if (_.isUndefined(currentField)) {
      return state;
    }
    return _.update(state, keys, (n) =>
      _.assign(n, {
        [fieldName]: getDefaultSchema('string'),
      }),
    );
  };

  const addChildField = ({ keys }: { keys: string[] }) => {
    setSchema((prevState) => {
      fieldNum += 1;
      const fieldName = `field_${fieldNum}`;
      const originalState = _.clone(prevState);
      handleAddChildField(prevState, keys, fieldName);
      return addRequiredFields(originalState, keys, fieldName);
    });
  };

  const setOpenValue = ({ key, value }: { key: string[]; value?: boolean }) => {
    setOpen((prevState) => {
      const clonedState = _.cloneDeep(prevState);
      const status = _.isUndefined(value) ? !_.get(prevState, key) : value;
      return _.set(clonedState, key, status);
    });
  };

  function handleObject(properties: Record<string, any>, checked: boolean) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in properties) {
      if (properties[key].type === 'array' || properties[key].type === 'object')
        handleSchemaRequired(properties[key], checked);
    }
  }

  function getFieldsTitle(data: any): string[] {
    const requiredTitle: string[] = [];
    Object.keys(data).forEach((title) => {
      requiredTitle.push(title);
    });
    return requiredTitle;
  }

  return {
    schema,
    open,
    changeEditorSchema,
    changeName,
    changeValue,
    changeType,
    enableRequire,
    requireAll,
    deleteItem,
    addField,
    addChildField,
    setOpenValue,
  };
};
