// Libraries
import { createContext, Dispatch } from 'react'
import produce from "immer";

// Constants
import {
  actionType,
  getIdCustomers,
  initCustomers,
  FilterChild
} from 'views/CustomerListView/constants'

interface InitialState {
  customers: FilterChild[][],
  name: string
}
interface DispatchAction {
  type: string;
  payload: any;
}

const initialState: InitialState = {
  name: '',
  customers: [[
    { ...initCustomers }
  ]],
  // isError: true
}

const StoreCustomerList = createContext<{
  state: InitialState,
  dispatch: Dispatch<DispatchAction>
}>({
  state: initialState,
  dispatch: () => undefined,
})

const reducerCustomerList = (state: InitialState, action: DispatchAction): InitialState => {
  const { payload } = action;
  const { customers } = state;

  switch (action.type) {
    case actionType.UPDATE_NAME: {
      return { ...state, ...payload };
    }
    case actionType.ADD_FILTER_CHILD: {
      const { location } = payload;
      const [indexOfFilterParent] = location;
      const arrCustomer = produce(customers, (draft: any) => {
        draft[indexOfFilterParent].push({
          ...initCustomers,
          id: getIdCustomers()
        });
      });

      return { ...state, customers: arrCustomer };
    }
    case actionType.REMOVE_FILTER_CHILD: {
      const { location } = payload;
      const [indexOfFilterChild, indexOfFilterParent] = location;
      const arrCustomer = customers.length ? produce(customers, (draft: any) => {
        const customerBlockParent = draft[indexOfFilterParent];

        if (customerBlockParent) {
          if (customerBlockParent.length > 1) {
            draft[indexOfFilterParent].splice([indexOfFilterChild], 1);
          } else {
            draft.splice([indexOfFilterParent], 1);
          }
        }
      }) : [[{ ...initCustomers }]]

      return { ...state, customers: arrCustomer };
    }
    case actionType.ADD_FILTER_PARENT: {
      const arrCustomer = produce(customers, (draft: any) => {
        draft.push([{
          ...initCustomers,
          id: getIdCustomers()
        }]);
      });

      return { ...state, customers: arrCustomer };
    }
    case actionType.REMOVE_FILTER_PARENT: {
      const { location } = payload;
      const [indexOfFilterParent] = location;
      const arrCustomer = customers.length ? produce(customers, (draft: any) => {
        draft.splice([indexOfFilterParent], 1);
      }) : [[{ ...initCustomers }]]

      return { ...state, customers: arrCustomer };
    }
    case actionType.UPDATE_CUSTOMER_FILTER: {
      const { location = [], update } = payload;
      const [indexOfFilterChild, indexOfFilterParent] = location;

      if (!(indexOfFilterParent >= 0 || indexOfFilterChild >= 0)) { return { ...state } }

      const arrCustomer = produce(customers, (draft: any) => {
        draft[indexOfFilterParent][indexOfFilterChild] = {
          ...initCustomers,
          ...draft[indexOfFilterParent][indexOfFilterChild],
          ...update
        };

      });

      return { ...state, customers: arrCustomer };
    }
    case actionType.UPDATE_CUSTOMER_STATE: {
      const { customers } = payload

      return { ...state, customers };
    }
    case actionType.INIT_CUSTOMER: {
      return {
        ...state,
        name: '',
        customers: [[
          { ...initCustomers }
        ]],
      };
    }
    default: {
      return { ...state }
    }
  }
}

export {
  StoreCustomerList,
  reducerCustomerList,
  initialState
};
