const toJson = (item) => {
  return {
    id: item.id,
    name: item.name,
    minScore: parseFloat(item.minScore),
    maxScore: parseFloat(item.maxScore),
    step: parseFloat(item.step),
    typeInput: item.typeInput,
    questionId: item.questionId,
    categoryId: item.categoryId,
    status: item.status
  }
}

const fromJson = (item) => {
  return {
    id: item.id,
    name: item.name,
    minScore: item.minScore.toString(),
    maxScore: item.maxScore.toString(),
    step: item.step.toString(),
    typeInput: item.typeInput,
    questionId: item.questionId,
    question: item.question,
    categoryId: item.categoryId,
    category: item.category,
    status: item.status
  }
}

const baseJson = () => {
  return {
    id: null,
    name: null,
    minScore: 0,
    maxScore: 0,
    step: 0,
    typeInput: 'radio',
    questionId: null,
    categoryId: null,
    status: 1
  }
}

export const surveyAnswerModel = {
  toJson,
  fromJson,
  baseJson
}
