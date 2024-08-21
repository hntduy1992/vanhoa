const toJson = (item) => {
  return {
    id: item.id,
    parentId: item.parentId ?? 0,
    name: item.name,
    minScore: parseFloat(item.minScore),
    maxScore: parseFloat(item.maxScore),
    condition: item.condition,
    type: item.type,
    categoryId: item.categoryId,
    status: item.status
  }
}

const fromJson = (item) => {
  return {
    id: item.id,
    parentId: item.parentId,
    parent: item.parent,
    name: item.name,
    minScore: item.minScore,
    maxScore: item.maxScore,
    condition: item.condition,
    type: item.type,
    categoryId: item.categoryId,
    category: item.category,
    status: item.status
  }
}

const baseJson = () => {
  return {
    id: null,
    parentId: null,
    name: null,
    minScore: null,
    maxScore: null,
    condition: 'and',
    type: 'DG',
    categoryId: null,
    status: 1
  }
}

export const surveyQuestionModel = {
  toJson,
  fromJson,
  baseJson
}
