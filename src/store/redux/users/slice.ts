import filter from "lodash/filter";
import { createSlice } from "@reduxjs/toolkit";
import { UserType } from "_types_/UserType";
import { RootState } from "store/index";
import { WritableDraft } from "immer/dist/types/types-external";

export interface UserState {
  loading: boolean;
  usersGroup: {
    id: string;
    name: string;
    extra?: Partial<any>;
  }[];
  users: UserType[];
  telesaleUsers: UserType[];
  saleOfflineUsers: UserType[];
  leadSaleOfflineUsers: UserType[];
  telesaleOnlineUsers: UserType[];
  leaderAndTelesaleUsers: UserType[];
  activeUsers: UserType[];
  isSuccessAction?: "success" | "failed";
  message: string;
  isShowWelcome: boolean;
}

const initialState: UserState = {
  loading: false,
  usersGroup: [],
  isSuccessAction: undefined,
  message: "",
  isShowWelcome: false,
  users: [],
  activeUsers: [],
  leaderAndTelesaleUsers: [],
  saleOfflineUsers: [],
  leadSaleOfflineUsers: [],
  telesaleUsers: [],
  telesaleOnlineUsers: [],
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.

export const userSlice = createSlice({
  name: "users",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    fetchAllUser: (state: WritableDraft<UserState>) => {
      state.loading = true;
      state.message = "";
      state.isSuccessAction = undefined;
    },
    fetchAllUsersGroup: (state: WritableDraft<UserState>, action: any) => {
      state.usersGroup = action.payload;
    },
    fetchAllUserRes: (state: WritableDraft<UserState>, action: any) => {
      const { users }: { users: UserType[] } = action.payload || {};

      const {
        activeUsers,
        leaderAndTelesaleUsers,
        telesaleOnlineUsers,
        telesaleUsers,
        leadSaleOfflineUsers,
        saleOfflineUsers,
      } = attachUsers(users);

      state.users = users;
      state.activeUsers = activeUsers;
      state.leaderAndTelesaleUsers = leaderAndTelesaleUsers;
      state.telesaleUsers = telesaleUsers;
      state.telesaleOnlineUsers = telesaleOnlineUsers;

      state.leadSaleOfflineUsers = leadSaleOfflineUsers;
      state.saleOfflineUsers = saleOfflineUsers;

      state.message = "";
      state.loading = false;
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
    },
    createUser: (state: WritableDraft<UserState>) => {
      state.isSuccessAction = undefined;
      state.message = "";
    },
    updateUser: (state: WritableDraft<UserState>) => {
      state.isSuccessAction = undefined;
      state.message = "";
    },
    createUserResponse: (state: WritableDraft<UserState>, action: any) => {
      if (action.payload.data) {
        const newUser: UserType = action.payload.data;

        const {
          activeUsers,
          leaderAndTelesaleUsers,
          telesaleOnlineUsers,
          telesaleUsers,
          leadSaleOfflineUsers,
          saleOfflineUsers,
        } = attachUsers([newUser]);

        state.activeUsers = [...activeUsers, ...state.activeUsers];
        state.leaderAndTelesaleUsers = [...leaderAndTelesaleUsers, ...state.leaderAndTelesaleUsers];
        state.telesaleUsers = [...telesaleUsers, ...state.telesaleUsers];
        state.telesaleOnlineUsers = [...telesaleOnlineUsers, ...state.telesaleOnlineUsers];

        state.leadSaleOfflineUsers = [...leadSaleOfflineUsers, ...state.leadSaleOfflineUsers];
        state.saleOfflineUsers = [...saleOfflineUsers, ...state.saleOfflineUsers];

        state.users = [newUser, ...state.users];
        state.isSuccessAction = "success";
      } else {
        state.isSuccessAction = "failed";
      }
      state.message = action.payload.message;
    },
    updateUserResponse: (state: WritableDraft<UserState>, action: any) => {
      state.message = action.payload.message;
      if (action.payload.data) {
        const userRes = action.payload.data;

        const userId = userRes.id;

        const idxUser = state.users.findIndex((item) => item.id === userId);
        if (idxUser >= 0) {
          state.users[idxUser] = {
            ...state.users[idxUser],
            ...userRes,
          };
          const {
            activeUsers,
            leaderAndTelesaleUsers,
            telesaleOnlineUsers,
            telesaleUsers,
            leadSaleOfflineUsers,
            saleOfflineUsers,
          } = attachUsers(state.users);
          state.activeUsers = activeUsers;
          state.leaderAndTelesaleUsers = leaderAndTelesaleUsers;
          state.telesaleOnlineUsers = telesaleOnlineUsers;
          state.telesaleUsers = telesaleUsers;

          state.leadSaleOfflineUsers = leadSaleOfflineUsers;
          state.saleOfflineUsers = saleOfflineUsers;
        }
        state.isSuccessAction = "success";
      } else {
        state.isSuccessAction = "failed";
      }
    },
    deleteUserResponse: (state: WritableDraft<UserState>, action: any) => {
      const { id, message } = action.payload;
      if (id) {
        state.users = filter(state.users, (user) => id !== user.id);
        const {
          activeUsers,
          leaderAndTelesaleUsers,
          telesaleOnlineUsers,
          telesaleUsers,
          leadSaleOfflineUsers,
          saleOfflineUsers,
        } = attachUsers(state.users);

        state.activeUsers = activeUsers;
        state.leaderAndTelesaleUsers = leaderAndTelesaleUsers;
        state.telesaleOnlineUsers = telesaleOnlineUsers;
        state.telesaleUsers = telesaleUsers;

        state.leadSaleOfflineUsers = leadSaleOfflineUsers;
        state.saleOfflineUsers = saleOfflineUsers;

        state.isSuccessAction = "success";
      } else {
        state.isSuccessAction = "failed";
      }
      state.message = message;
    },
    resetToast: (state: WritableDraft<UserState>) => {
      state.message = "";
      state.isSuccessAction = undefined;
    },
    setShowWelcomePopup: (state: WritableDraft<UserState>, action: any) => {
      state.isShowWelcome = action.payload;
    },
    reset: (state: WritableDraft<UserState>) => {
      state.loading = false;
      state.users = [];
      state.activeUsers = [];
      state.leaderAndTelesaleUsers = [];
      state.telesaleUsers = [];
      state.telesaleOnlineUsers = [];
      state.leadSaleOfflineUsers = [];
      state.saleOfflineUsers = [];
      state.isSuccessAction = undefined;
      state.message = "";
      state.isShowWelcome = false;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.

  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchUser.pending, (state:WritableDraft<UserState>) => {
  //       state.loading = true;
  //     })
  //     .addCase(fetchUser.fulfilled, (state:WritableDraft<UserState>, action:any) => {
  //       state.loading = false;
  //       state.users = action.payload;
  //     });
  // },
});
export const {
  reset: userReset,
  resetToast,
  setShowWelcomePopup,
  fetchAllUsersGroup,
} = userSlice.actions;

export const userStore = (state: RootState) => state.users;

export default userSlice.reducer;

const attachUsers = (users: UserType[]) => {
  let activeUsers: UserType[] = [],
    leaderAndTelesaleUsers: UserType[] = [],
    telesaleUsers: UserType[] = [],
    telesaleOnlineUsers: UserType[] = [],
    saleOfflineUsers: UserType[] = [],
    leadSaleOfflineUsers: UserType[] = [];

  users.map((item) => {
    //active users
    if (item.is_active) {
      activeUsers = [...activeUsers, item];
      // lead and sale users
      if (
        item.group_permission?.code === "telesale" ||
        item.group_permission?.code === "telesalelead"
      ) {
        leaderAndTelesaleUsers = [...leaderAndTelesaleUsers, item];
        // sale users
        if (item.group_permission?.code === "telesale") {
          telesaleUsers = [...telesaleUsers, item];
          //sale is online users
          if (item.is_online) {
            telesaleOnlineUsers = [...telesaleOnlineUsers, item];
          }
        }
      }
      if (
        item.group_permission?.code === "sale_offline" ||
        item.group_permission?.code === "lead_sale_offline"
      ) {
        leadSaleOfflineUsers = [...leadSaleOfflineUsers, item];
        // sale users
        if (item.group_permission?.code === "sale_offline") {
          saleOfflineUsers = [...saleOfflineUsers, item];
        }
      }
    }
  });
  return {
    activeUsers,
    leaderAndTelesaleUsers,
    telesaleUsers,
    telesaleOnlineUsers,
    saleOfflineUsers,
    leadSaleOfflineUsers,
  };
};
