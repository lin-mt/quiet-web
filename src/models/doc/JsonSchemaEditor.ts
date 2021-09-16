import { useState } from 'react';
import { handleSchema } from '@/pages/components/JsonSchemaEditor/utils';
import _ from 'lodash';
import { getDefaultSchema } from '@/pages/components/JsonSchemaEditor/constants';

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

const fieldNums: Record<string, number> = {};

export default () => {
  const [schema, setSchema] = useState<Record<string, SchemaProp>>({});

  const [open, setOpen] = useState<Record<string, any>>({});

  const getAndAddFieldNum = (id: string): number => {
    const num = fieldNums[id];
    if (!num) {
      fieldNums[id] = 1;
      return 0;
    }
    fieldNums[id] = num + 1;
    return num;
  };

  const initSchemaInfo = (id: string) => {
    setSchema((prevState) => {
      return {
        ...prevState,
        [id]: {
          type: 'object',
          properties: {},
          required: [],
        },
      };
    });
    setOpen((prevState) => {
      return {
        ...prevState,
        [id]: {
          properties: true,
        },
      };
    });
  };

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

  const changeEditorSchemaWithId = (id: string, { value }: { value: any }) => {
    setSchema((prevState) => {
      const newVal = handleSchema(value);
      return { ...prevState, [id]: { ...newVal } };
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

  const changeNameWithId = (
    id: string,
    { keys, name, value }: { keys: string[]; name: string; value: string },
  ) => {
    setSchema((prevState) => {
      const clonedState = _.cloneDeep(prevState[id]);
      const items = _.get(clonedState, keys);
      const keyExists = Object.keys(items).indexOf(value) >= 0 && items[value] === 'object';
      if (keyExists || !_.has(items, name)) {
        return prevState;
      }
      items[value] = items[name];
      delete items[name];
      const newState = addRequiredFields(clonedState, keys, value);
      return { ...prevState, [id]: { ...removeRequireField(newState, keys, name) } };
    });
  };

  const handleDelete = (state: SchemaProp, { keys }: { keys: string[] }) => {
    const clonedState = _.clone(state);
    _.unset(clonedState, keys);
    return clonedState;
  };

  const changeValueWithId = (id: string, { keys, value }: { keys: string[]; value: any }) => {
    setSchema((prevState) => {
      const newSchema = _.cloneDeep(prevState[id]);
      if (value) {
        _.set(newSchema, keys, value);
        return { ...prevState, [id]: { ...newSchema } };
      }
      return { ...prevState, [id]: { ...handleDelete(newSchema, { keys }) } };
    });
  };

  const changeTypeWithId = (id: string, { keys, value }: { keys: string[]; value: string }) => {
    setSchema((prevState) => {
      const parentKeys: string[] = getParentKey(keys);
      const parentData = parentKeys.length ? _.get(prevState[id], parentKeys) : prevState[id];
      const clonedState = _.cloneDeep(prevState[id]);
      if (parentData.type === value) {
        return { ...prevState, [id]: { ...clonedState } };
      }
      const description = parentData.description ? { description: parentData.description } : {};
      const newParentDataItem = { ...getDefaultSchema(value), ...description };
      if (parentKeys.length === 0) {
        return { ...prevState, [id]: { ...newParentDataItem } };
      }
      return { ...prevState, [id]: { ..._.set(clonedState, parentKeys, newParentDataItem) } };
    });
  };

  const enableRequireWithid = (
    id: string,
    { keys, name, required }: { keys: string[]; name: string; required: boolean },
  ) => {
    setSchema((prevState) => {
      const parentKeys: string[] = getParentKey(keys);
      const clonedState = _.cloneDeep(prevState[id]);
      const parentData = parentKeys.length ? _.get(prevState[id], parentKeys) : prevState[id];
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
      return { ...prevState, [id]: { ..._.set(clonedState, parentKeys, requiredArray) } };
    });
  };

  const handleSchemaRequired = (oldSchema: SchemaProp, checked: boolean): any => {
    const newSchema = _.cloneDeep(oldSchema);
    if (newSchema.type === 'object') {
      const requiredTitle = getFieldsTitle(newSchema.properties);
      if (checked) {
        newSchema.required = requiredTitle;
      } else {
        delete newSchema.required;
      }
      if (newSchema.properties) {
        newSchema.properties = handleObject(newSchema.properties, checked);
      }
    } else if (newSchema.type === 'array') {
      if (newSchema.items) {
        newSchema.items = handleSchemaRequired(newSchema.items, checked);
      }
    }
    return newSchema;
  };

  function handleObject(properties: Record<string, any>, checked: boolean) {
    const newProperties = _.cloneDeep(properties);
    // eslint-disable-next-line no-restricted-syntax
    for (const key in newProperties) {
      if (newProperties[key].type === 'array' || newProperties[key].type === 'object')
        newProperties[key] = handleSchemaRequired(newProperties[key], checked);
    }
    return newProperties;
  }

  const requireAllWithId = (id: string, required: boolean) => {
    setSchema((prevState) => {
      let schemaForChange = _.cloneDeep(prevState[id]);
      schemaForChange = handleSchemaRequired(schemaForChange, required);
      return { ...prevState, [id]: { ...schemaForChange } };
    });
  };

  const deleteItemWithId = (id: string, { keys }: { keys: string[] }) => {
    setSchema((prevState) => {
      const clonedState = _.clone(prevState[id]);
      _.unset(clonedState, keys);
      return { ...prevState, [id]: { ...clonedState } };
    });
  };

  const addFieldWithId = (id: string, { keys, name }: { keys: string[]; name: string }) => {
    setSchema((prevState) => {
      const clonedState = _.cloneDeep(prevState[id]);
      const propertiesData = _.get(prevState[id], keys);
      let newPropertiesData: Record<string, any> = {};
      const fieldName = `field_${getAndAddFieldNum(id)}`;

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
      return { ...prevState, [id]: { ...addRequiredFields(newState, keys, fieldName) } };
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

  const addChildFieldWithId = (id: string, { keys }: { keys: string[] }) => {
    setSchema((prevState) => {
      const fieldName = `field_${getAndAddFieldNum(id)}`;
      const originalState = _.clone(prevState[id]);
      handleAddChildField(prevState[id], keys, fieldName);
      return { ...prevState, [id]: { ...addRequiredFields(originalState, keys, fieldName) } };
    });
  };

  const setOpenValueWithId = (id: string, { key, value }: { key: string[]; value?: boolean }) => {
    setOpen((prevState) => {
      const clonedState = _.cloneDeep(prevState[id]);
      const status = _.isUndefined(value) ? !_.get(prevState[id], key) : value;
      return { ...prevState, [id]: { ..._.set(clonedState, key, status) } };
    });
  };

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
    initSchemaInfo,
    changeEditorSchemaWithId,
    changeNameWithId,
    changeValueWithId,
    changeTypeWithId,
    enableRequireWithid,
    requireAllWithId,
    deleteItemWithId,
    addFieldWithId,
    addChildFieldWithId,
    setOpenValueWithId,
  };
};
