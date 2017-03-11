import * as _ from 'lodash';
import * as moment from 'moment';
import { handleActions, Action } from 'redux-actions';
import { Point2D } from '../scatterPlotWidget/models';
import { DateTimePoint } from '../linearChart/models/dateTimePoint';

import { GraphScreenState } from './model';
import {
  CHANGE_DATE_FROM_VALUE,
  CHANGE_DATE_TO_VALUE
} from './actions';

const SAMPLE_VALUE_MAX = 150;
const DATE_RANGE_MIN_VALUE = moment("2010-05-01");
const DATE_RANGE_MAX_VALUE = moment("2010-05-28");
const DATE_WINDOW_FROM_VALUE = moment("2010-05-03");
const DATE_WINDOW_TO_VALUE = moment("2010-05-05");
const SAMPLES_EVERY_MINUTE = 5;

const randomDateTimePoints = () => {
  var referenceDate = DATE_RANGE_MIN_VALUE.clone();
  var result = [];
  while (referenceDate.isBefore(DATE_RANGE_MAX_VALUE)) {
    result.push(<DateTimePoint>{ time: referenceDate.clone(), value: 180*referenceDate.hours() + referenceDate.minutes() });
    referenceDate.add("minutes", SAMPLES_EVERY_MINUTE);
  }
  return result;
}


const initialState: GraphScreenState = <GraphScreenState>{
    dateFrom: DATE_WINDOW_FROM_VALUE,
    dateTo: DATE_WINDOW_TO_VALUE,
    points: randomDateTimePoints()
};

export default handleActions<GraphScreenState, GraphScreenState>({
  /**
   * See that:
   * 1) state is automagically passed from store !
   * 2) action (with payload type of moment.Moment) is created by action generator
   */
  [CHANGE_DATE_FROM_VALUE]: (state: GraphScreenState, action: Action<moment.Moment>): GraphScreenState => {
    console.log(CHANGE_DATE_FROM_VALUE);
    if (action.payload.isBefore(DATE_RANGE_MIN_VALUE)) {
      console.log(`rejecting - ${action.payload.toDate()} is before date range min value ${DATE_RANGE_MIN_VALUE.toDate()}`);
      return state;
    }
    return {
      dateFrom: action.payload,
      dateTo: state.dateTo.clone(),
      points: _.clone(state.points)
    };
  },

  [CHANGE_DATE_TO_VALUE]: (state: GraphScreenState, action: Action<moment.Moment>): GraphScreenState => {
    console.log(CHANGE_DATE_TO_VALUE);
    if (action.payload.isAfter(DATE_RANGE_MAX_VALUE)) {
      console.log(`rejecting - ${action.payload.toDate()} is after date range max value ${DATE_RANGE_MIN_VALUE.toDate()}`);
      return state;
    }
    return {
      dateFrom: state.dateFrom.clone(),
      dateTo: action.payload,
      points: _.clone(state.points)
    };
  },
}, initialState);
