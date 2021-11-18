import {
    HashRouter as Router,
    Route,
    Redirect
} from 'react-router-dom';

import SignIn from '../containers/auth/signIn';
import SignUp from '../containers/auth/signUp';
import Dashboard from '../containers/dashboard';
import Users from '../containers/users/list';
import NewInvitation from '../containers/workers/invitation';
import User from '../containers/users';
import NewUser from '../containers/users/new';
import FakeUser from '../containers/fakeUsers';
import { getUserDetails, isAllowedRole } from '../utils/auth';
import { commonConstants } from "../constants/common";

const PrivateRoute = ({ roles: Roles, userDetails: UserDetails, component: Component, ...rest }) =>{
    const details = UserDetails();
    
    console.log({details, isAllowedRole: isAllowedRole(Roles, details), Roles, isAllowedRole: isAllowedRole(Roles, details)})
    return  (
    <Route {...rest} render={function (props) {
        const details = UserDetails();
        if (!details) {
            return <Redirect to={{
                pathname: '/signIn',
                state: { from: props.location }
            }}/>;
        }
        console.log("rendering component 2")

        if (!isAllowedRole(Roles, details)) {
            return <Redirect to={{
                pathname: '/dashboard'
            }}/>;
        }
        console.log("rendering component")
        return <Component {...props}/>;
    }}/>
);
}


const Routing = () => (
    <Router>
        <div>
            <Route path="/signIn" component={SignIn}/>
            <Route path="/signUp" component={SignUp}/>
            <PrivateRoute exact path="/" component={Dashboard} roles={[commonConstants.REGULAR_ROLE, commonConstants.ADMIN_ROLE]} userDetails={getUserDetails}/>
            <PrivateRoute exact path="/dashboard" component={Dashboard} roles={[commonConstants.REGULAR_ROLE, commonConstants.ADMIN_ROLE]} userDetails={getUserDetails}/>
            <PrivateRoute exact path="/workers/newInvitation" component={NewInvitation} roles={[commonConstants.ADMIN_ROLE]} userDetails={getUserDetails}/>
            <PrivateRoute exact path="/workers/:workerId/fakeUsers/new" component={FakeUser} roles={[commonConstants.REGULAR_ROLE, commonConstants.ADMIN_ROLE]} userDetails={getUserDetails}/>
            <PrivateRoute exact path="/workers/:workerId/fakeUsers/edit/:id" component={FakeUser} roles={[commonConstants.REGULAR_ROLE, commonConstants.ADMIN_ROLE]} userDetails={getUserDetails}/>
            <PrivateRoute exact path="/workers/:workerId/edit/:id" component={FakeUser} roles={[commonConstants.REGULAR_ROLE, commonConstants.ADMIN_ROLE]} userDetails={getUserDetails}/>
            <PrivateRoute exact path="/users/new" component={NewUser} roles={[commonConstants.REGULAR_ROLE, commonConstants.ADMIN_ROLE]} userDetails={getUserDetails}/>
            <PrivateRoute exact path="/users" component={Users} roles={[commonConstants.REGULAR_ROLE, commonConstants.ADMIN_ROLE]} userDetails={getUserDetails}/>
            <PrivateRoute exact path="/users/edit/:id" component={User} roles={[commonConstants.REGULAR_ROLE, commonConstants.ADMIN_ROLE]} userDetails={getUserDetails}/>
        </div>
    </Router>
);

export default Routing;
