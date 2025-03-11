import { apiClient } from '@/services/axios'
import { toastService } from '@/services/toast'
import { toSnakeCase } from '@/composables/caseConvert'

export const fetchAutocomplete = async (event, model, field) => {
  const response = await apiClient.get(`/${model}/autocomplete`, {
    params: {
      field: toSnakeCase(field),
      query: event.query
    }
  })
  return response.data
}

export const fetchItem = async (api, query = {}) => {
  const response = await apiClient.get(api, { params: query })
  if (response.status === 204) {
    return null
  }
  return response.data
}

export const fetchItems = async (api, query = {}) => {
  const response = await apiClient.get(api, { params: query })
  if (response.status === 204) {
    return []
  }
  return response.data
}

export const createItem = async ({ model, values, detail }) => {
  try {
    const response = await apiClient.post(`/${model}`, values)
    toastService.add({
      severity: 'success',
      detail: detail.success
    })
    return response.data
  } catch (error) {
    toastService.add({
      severity: 'error',
      detail: detail.error
    })
  }
}

export const updateItem = async ({ model, modelId, values, detail }) => {
  try {
    const response = await apiClient.patch(`/${model}/${modelId}`, values)
    toastService.add({
      severity: 'success',
      detail: detail.success
    })
    return response.data
  } catch (error) {
    toastService.add({
      severity: 'error',
      detail: detail.error
    })
  }
}

export const deleteItem = async ({ model, modelId, detail }) => {
  try {
    const response = await apiClient.delete(`/${model}/${modelId}`)
    toastService.add({
      severity: 'success',
      detail: detail.success
    })
    return response.data
  } catch (error) {
    toastService.add({
      severity: 'error',
      detail: detail.error
    })
  }
}
