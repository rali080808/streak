import { useState, useContext } from 'react'
import { DataContext } from '../DataProvider';
import { createClient } from "@supabase/supabase-js";
import styles from '../styles/Login.module.css';
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

function Login() {
    const { userID, setUserID, username, setUsername, setIsLoggedIn } = useContext(DataContext);
    let [password, setPassword] = useState('');
    let [loginType, setLoginType] = useState("Login")

    async function login() {
        /**
         * TODO no hardcoded values
         * check loginType
         * email field for SignUp
         * user must login after signup
         */
        if (loginType === "Login") {

            const { data, error } = await supabase.auth.signInWithPassword({
                email: username + "@fakeemail.com",
                password: password,

            });

            if (error) {
                console.error("Login failed:", error);
            } else {
                alert("Logged in")

                setUserID(data.user.id);
                setIsLoggedIn(true)
            }
        }
        else {
            const { data, error } = await supabase.auth.signUp({
                email: username + "@fakeemail.com",
                password: password,
                options: {
                    data: {
                        display_name: username
                    }
                }
            });

            if (error) {
                alert(error.message);
            } else {
                setUserID(data.user.id);
                console.log(data)
                console.log("username stored:", data.user?.user_metadata?.display_name)
                setUsername(data.user?.user_metadata?.display_name);
                if (data.user?.identities?.length === 0) {
                    alert("User already exists! Loggging in instead...");
                } else {
                    const { _, __ } = await supabase.auth.signInWithPassword({
                        email: username + "@fakeemail.com",
                        password: password
                    });
                    alert("Logged in");
                    setIsLoggedIn(true)
                }


            }
        }
    }



    return <div className={styles.container} >

        <select defaultValue={"Login"} onChange={(e) => setLoginType(e.target.value)}>
            <option value={"Signup"}>Sign up</option>
            <option value={"Login"}>Log in</option>
        </select>
        <label>Username</label> <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>{loginType === "Signup" ? "Choose a password" : "Password"}</label> <input placeholder="paSSw@rd" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className={loginType === "Login" ? styles.Login : styles.Signup} onClick={login}> {loginType} </button>
    </div>;
}
export default Login;