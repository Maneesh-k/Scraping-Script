const axios = require("axios")

function axiosInstanceWithRetry() {
	const axiosInstance = axios.create({ timeout: 20000})

	const maxRetries = 5

	axiosInstance.interceptors.response.use(
		response => response,
		async error => {
			const { config, response } = error

			config.retryCount = config.retryCount || 0

			if (
				config?.retry > 0 &&
				config.retry <= maxRetries &&
				(response?.status === 429 ||
					response?.status === 500 ||
					response?.status === 501 ||
					response?.status === 503)
			) {
				config.retryCount += 1

				config.retry -= 1

				const retryDelay = Math.round(response?.headers?.["retry-after"]) || 1

				const delay = retryDelay * 1000

				const key = {}

				const now = Date.now()

				key[`${now}`] = delay

				await new Promise(resolve => setTimeout(resolve, delay))

				return axiosInstance(config)
			}

			return Promise.reject(error)
		}
	)

	return axiosInstance
}

const axiosWithRetry = axiosInstanceWithRetry()


const getRequest = async (url, config) => {

	const [err, res] = await asyncWrapper(axiosWithRetry.get(url, config))

	return [err, res]
}

const postRequest = async (url, data, config) => {

	const [err, res] = await asyncWrapper(axiosWithRetry.post(url, data, config))

	return [err, res]
}

const putRequest = async (url, data, config) => {

	const [err, res] = await asyncWrapper(axiosWithRetry.put(url, data, config))

	return [err, res]
}

const deleteRequest = async (url, config) => {
	const [err, res] = await asyncWrapper(axiosWithRetry.delete(url, config))

	return [err, res]
}

const asyncWrapper = promise => {
	return new Promise(resolve => {
		promise.then(data => resolve([null, data])).catch(err => resolve([err]))
	})
}


module.exports = {
	getRequest,
	asyncWrapper,
	postRequest,
	putRequest,
	deleteRequest,
}
