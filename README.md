This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 1.Install

### npm

```
npm i
or
npm i --legacy-peer-deps
```

### yarn

```
yarn
```

## 2.Start

```sh
npm start
or
yarn start
```

## 3.Build

```sh
npm run build or yarn build
```

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

Your app is ready to be deployed.

## User Guide

You can find detailed instructions on using Create React App and many tips in [its documentation](https://facebook.github.io/create-react-app/).

## Merge commit

### Status
 - Bugfix
 - Features
 - Refactor
 - Docs
### Task name

-- status/epic - task_code/task-name

example: features/a - AV-165/show ecommerce code
features/a - tên nhánh
AV-165 là mã task
show ecommerce code là title của task

### Functions
#### 1. useCancelToken
a. Use cancelToken
```javascript
 const { newCancelToken } = useCancelToken();
 
 const fetchData = async ()=>{
     const result = await callApi(endpoint, params = {...params, cancelToken: newCancelToken()})
 }
 
 useEffect(()=>{
     fetchData();
 },[...dependencies, newCancelToken])
```
b. Convert cancelToken in params
```javascript
    const fetchDataApi = async <T>(endpoint,params) => {
  const { cancelToken, paramsNoneCancelToken } = convertCancelToken(params);

  const paramsURL = formatParamsToURLUtil(keyFilter, paramsNoneCancelToken);
  try {
    const result = await APIConfig(baseUrl).get(endpoint, { params: paramsURL, cancelToken});
    return result
  } catch (error) {
    return error
  }
};
```
### Import theo cấu trúc
    - components
    - images
    - stylesheets
    - Hooks
    - utility

```tsx
import { Routes, Route } from "react-router-dom";
import { createSlice } from "@reduxjs/toolkit";
import { Menu } from "@headlessui/react";
import Home from "./Home";
import logo from "./logo.svg";
import "./App.css";
```

### Tuân thủ quy ước đặt tên
    - PascalCase chủ yếu dành cho component
    - camelCase chủ yếu đặt cho functions, hooks, variables, arrays
    
    ```tsx
    const [firstName, setFirstName] = useState("Ihechikara");
    const studentList = [];
    const studentObject = {};
    const getStudent = () => {}
    ```
    
### Gom nhóm state
    - Thay vì
    
    ```tsx
    const [username, setusername] = useState('')
    const [password, setpassword] = useState('')
    ```
    
    - Nên sử dụng
    
    ```tsx
    const [user, setuser] = useState({})
    ```
    
### Destructor props

```tsx
const [user, setuser] = useState({})
```

### Làm rõ các biến
    
    ```tsx
    // Declare them as capitalized named constants.
    const MILLISECONDS_PER_HOUR = 60 * 60 * 1000; // 36000000
    
    setTimeout(restart, MILLISECONDS_PER_HOUR);
    ```
    
### Không lặp lại tên biến không cần thiết

```tsx
// old
type User = {
  userName: string;
  userLastName: string;
  userAge: number;
}

function print(user: User): void {
  console.log(`${user.userName} ${user.userLastName} (${user.userAge})`);
}

//new
type User = {
  name: string;
  lastName: string;
  age: number;
}

function print(user: User): void {
  console.log(`${user.name} ${user.lastName} (${user.age})`);
}
```

### Tạo param object khi có 2 params trở lên

```tsx
//old 
type UserStatus = 'online' | 'offline';
function createUser(name: string, lastName: string, age: number, status: UserStatus) {
  // ...
}

createUser('Gapur', 'Kassym', 29, 'online');

//new
type UserStatus = 'online' | 'offline';
type User = { name: string, lastName: string, age: number, status: UserStatus };

function createUser(user: User) {
  // ...
}

createUser({
  name: 'Gapur',
  lastName: 'Kassym',
  age: 29,
  status: 'online'
});
```

### Nhất quán component

```tsx
// old
const renderHeader = () => {
  return (
    <div>
      <span>User:</span>
      {user.name && user.lastName && renderUserInfo()}
    </div>
  );
}

const renderUserInfo = () => {
  return <span>{`${user.name} ${user.lastName}`}</span>;
};

//new
const renderHeader = () => {
  return (
    <div>
      <span>User:</span>
      {renderUserInfo()}
    </div>
  );
}

const renderUserInfo = () => {
  if (user.name && user.lastName) {
    return <span>{`${user.name} ${user.lastName}`}</span>;
  }
  return null;
};
```

### Tạo biến để đặt giá trị mặc định

```jsx
//old
function createUser(user: User) {
  user.name = user.name || 'User';
  user.lastName = user.lastName || '';
  user.age = user.age || 18;
  // ...
}

//new
function createUser(user: User) {
  const userWithDefaultValues = {
    name: 'User',
    lastName: '',
    age: 18,
    ...user,
  };
  // ...
}
```
## Test render page
    1. Create test in _tests_
    2. Add code standar by Jest
    3. Add to App.test.ts file
    4. Run yarn test

## Thay đổi report domain
- devsyncdata -> backendsyncdata