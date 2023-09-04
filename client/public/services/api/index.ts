import { apiService } from 'ts-api-toolkit';

apiService.changeBaseUrl(`${process.env.REACT_APP_API_URL}`);
apiService.changeAuthSchema('Token');

export function errorHandler(error: { data?: { [key: string]: string[] } }, fallbackMessage: string) {
	return error?.data?.errors ? error.data.errors : { unknown: [fallbackMessage] };
}

export { apiService };
