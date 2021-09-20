import { combineReducers } from 'redux'
import weather, { WeatherState } from '../reducers/weather.reducer'

export interface IRootState {
  readonly weather: WeatherState;
}

const rootReducer = combineReducers<IRootState>({
  weather
});
export default rootReducer