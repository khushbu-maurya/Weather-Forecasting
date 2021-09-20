import axios from 'axios';
import { api, api_key, ipConfig } from '../../config';

export const ACTION_TYPES = {
    CITY_NAME_CHANAGE: 'weather/CITY_NAME_CHANAGE',
    SEARCH_WEATHER_BY_CITY_NAME: 'weather/SEARCH_WEATHER_BY_CITY_NAME',
    DEFAULT_CITY_NAME: 'weather/DEFAULT_CITY_NAME'
};

let isDataLoad = false;

const initialState = {
    cityName: "",
    weatherData: {},
}

export type WeatherState = Readonly<typeof initialState>;

export default (state: WeatherState = initialState, action: any): WeatherState => {
    switch (action.type) {
        case ACTION_TYPES.CITY_NAME_CHANAGE:
            return { ...state, cityName: action.payload }

        case ACTION_TYPES.SEARCH_WEATHER_BY_CITY_NAME:
            return { ...state, weatherData: action.payload }

        default:
            return state
    }
}


//Actions
export const cityNameChange = (changedValue: string, dispatch: any) => {
    dispatch({ type: ACTION_TYPES.CITY_NAME_CHANAGE, payload: changedValue })
}

export const searchWeatherByCityName = async (cityName: string, dispatch: any) => {
    let response: any;
    try {
        response = await axios.get(api + "data/2.5/forecast?q=" + cityName + "&appid=" + api_key);
        dispatch({ type: ACTION_TYPES.SEARCH_WEATHER_BY_CITY_NAME, payload: response.data });
    } catch (err: any) {
        if (err.message.includes(404)) {
            alert("City Not Found")
        } else {
            alert(err.message)
        }
    }
}

export const searchWeatherByCityNameAndState = async (cityName: string, dispatch: any) => {
    let response: any;
    try {
        dispatch({ type: ACTION_TYPES.CITY_NAME_CHANAGE, payload: cityName })
        response = await axios.get(api + "data/2.5/forecast?q=" + cityName + "&appid=" + api_key);
        dispatch({ type: ACTION_TYPES.SEARCH_WEATHER_BY_CITY_NAME, payload: response.data });
    } catch (err: any) {
        if (err.message.includes(404)) {
            alert("City Not Found")
        } else {
            console.error("err :: ", err);
        }
    }
}

export const getDefaultCityName = () => {
    if (isDataLoad == false) {
        try {
            axios.get(ipConfig).then(response => {
                window.location.href = "/city/" + response.data.city;
            }).catch(err => {
                console.error("Err : ", err)
            });
        } catch (err) {
            console.error("err :: ", err);
        }
    }
}