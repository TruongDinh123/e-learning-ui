import {createAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {authService} from './userService';

export const login = createAsyncThunk(
  '/e-learning/login',
  async (data, {rejectWithValue}) => {
    try {
      const response = await authService.loginAUser(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const registerUser = createAsyncThunk(
  '/e-learning/signup',
  async (data, {rejectWithValue}) => {
    try {
      const response = await authService.registerAUser(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAllUser = createAsyncThunk(
  '/e-learning/users',
  async (data, {rejectWithValue}) => {
    try {
      const response = await authService.getAllUser(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteUser = createAsyncThunk(
  '/e-learning/user/delete',
  async (data, {rejectWithValue}) => {
    try {
      const response = await authService.deleteUser(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateUser = createAsyncThunk(
  '/e-learning/update-user',
  async (data, {rejectWithValue, getState}) => {
    try {
      const response = await authService.updateUser(data);
      if (response.status) {
        const {user} = getState();
        const userUpdated = response.data?.metadata;

        if (user.user._id === userUpdated._id) {
          const userNameNew =
            (userUpdated.firstName ? userUpdated.firstName + ' ' : '') +
            (userUpdated.lastName ? userUpdated.lastName : '');

          localStorage.setItem('userName', JSON.stringify(userNameNew));
        }
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const uploadImageUser = createAsyncThunk(
  '/e-learning/user/upload-image',
  async (data, {rejectWithValue}) => {
    try {
      const response = await authService.uploadImageUser(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAUser = createAsyncThunk(
  '/e-learning/user',
  async (data, {rejectWithValue}) => {
    try {
      const response = await authService.getAUser(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const refreshAUser = createAsyncThunk(
  '/e-learning/user',
  async (data, {rejectWithValue}) => {
    try {
      const response = await authService.getAUser(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const logOut = createAsyncThunk(
  '/e-learning/log-out',
  async (data, {rejectWithValue}) => {
    try {
      const response = await authService.logOut(data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

//roles

export const getAllRole = createAsyncThunk(
  '/e-learning/role',
  async (data, {rejectWithValue}) => {
    try {
      const response = await authService.getAllRole(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateUserRoles = createAsyncThunk(
  '/e-learning/user/update-user-role',
  async (data, {rejectWithValue}) => {
    try {
      const response = await authService.updateUserRoles(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateRole = createAsyncThunk(
  '/e-learning/role/update',
  async (data, {rejectWithValue}) => {
    try {
      const response = await authService.updateRole(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteRole = createAsyncThunk(
  '/e-learning/role/delete',
  async (data, {rejectWithValue}) => {
    try {
      const response = await authService.deleteRole(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createRole = createAsyncThunk(
  '/e-learning/role/create',
  async (data, {rejectWithValue}) => {
    try {
      const response = await authService.createRole(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const changePassword = createAsyncThunk(
  '/e-learning/change-password',
  async (data, {rejectWithValue}) => {
    try {
      const response = await authService.changePassword(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  '/e-learning/forgot-password',
  async (data, {rejectWithValue}) => {
    try {
      const response = await authService.forgotPassword(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

let userFromLocalStorage = null;
let userNameFromLocalStogare = null;

if (typeof window !== 'undefined') {
  userFromLocalStorage = JSON.parse(localStorage?.getItem('user'));
  userNameFromLocalStogare = JSON.parse(localStorage?.getItem('userName'));
}

const initialState = {
  user: userFromLocalStorage,
  userName: userNameFromLocalStogare,
  profile: {},
  allUsers: null,
  allRoles: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const resetState = createAction('Reset_all');

const userSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    updateAllUser: (state, action) => {
      state.allUsers = action.payload;
    },
    updateAllRoles: (state, action) => {
      state.allRoles = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.user = action.error;
        state.message = 'Something went wrong!';
      })
      .addCase(registerUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.user = action.error;
      })
      .addCase(getAllUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.allUsers = action.payload.metadata?.users;
      })
      .addCase(deleteUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.allUsers = state.allUsers?.filter(
          (user) => user._id !== action.meta.arg
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(getAllRole.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;

        state.allRoles = action.payload.metadata;
      })
      .addCase(getAllRole.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(updateUserRoles.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateUserRoles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        const userRes = action.payload.data.metadata;
        state.allUsers = state.allUsers?.map((user) => {
          if (user._id === userRes._id) {
            const role = state.allRoles.find(
              (role) => role._id === userRes.roles[0]
            );

            return Object.assign(user, {
              roles: [role],
            });
          }
          return user;
        });
      })
      .addCase(updateUserRoles.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(updateRole.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.allRoles = state.allRoles.map((role) =>
          role._id === action.payload.data._id ? action.payload.data : role
        );
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(createRole.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(updateUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        const userRes = action.payload.metadata;

        state.allUsers = state.allUsers?.map((user) => {
          if (state.user._id === userRes._id) {
            state.userName = userRes.lastName + ' ' + userRes.firstName;
          }

          if (user._id === userRes._id) {
            return Object.assign(user, {
              lastName: userRes.lastName,
              firstName: userRes.firstName,
              email: userRes.email,
            });
          }
          return user;
        });
      })

      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(uploadImageUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(uploadImageUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;

        const {image_url} = action.payload.metadata;

        if (image_url) state.user.image_url = image_url;

        const currentUserImg = JSON.parse(localStorage.getItem('user'));

        const updatedUser = {
          ...currentUserImg,
          ...(image_url && {image_url}),
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));
      })
      .addCase(uploadImageUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(refreshAUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(refreshAUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.user = action.payload.metadata;
      })

      .addCase(refreshAUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(resetState, () => initialState);
  },
});

export const {setUser, setUserName, updateAllUser, updateAllRoles} =
  userSlice.actions;

export default userSlice.reducer;
