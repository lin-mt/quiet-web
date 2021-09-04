import _ from 'lodash';

function handleType(schema: any) {
  const returnVal = _.cloneDeep(schema);
  if (!returnVal.type && returnVal.properties && typeof returnVal.properties === 'object') {
    returnVal.type = 'object';
  }
  return returnVal;
}

export const handleSchema = (schema: any) => {
  let newSchema = _.cloneDeep(schema);
  if (newSchema && !newSchema.type && !newSchema.properties) {
    newSchema.type = 'string';
  }
  newSchema = handleType(newSchema);
  if (newSchema.type === 'object') {
    if (!newSchema.properties) {
      newSchema.properties = {};
    }
    newSchema.properties = handleObject(schema.properties);
  } else if (newSchema.type === 'array') {
    if (!newSchema.items) {
      newSchema.items = { type: 'string' };
    }
    newSchema.items = handleSchema(newSchema.items);
  }
  return newSchema;
};

function handleObject(properties: any) {
  const newProperties = _.cloneDeep(properties);
  Object.keys(newProperties).forEach((key) => {
    newProperties[key] = handleType(newProperties[key]);
    if (newProperties[key].type === 'array' || newProperties[key].type === 'object')
      newProperties[key] = handleSchema(newProperties[key]);
  });
  return newProperties;
}
