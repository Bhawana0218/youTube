"use client";

import { signInWithPopup, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, provider } from "./firebase";
import axiosInstance from "./axiosinstance";

const DEFAULT_USER_IMAGE =
    "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=150&q=80";

const normalizeUser = (userData) => {
    if (!userData) return null;
    if (userData._id && !userData.id) {
        userData.id = userData._id;
        delete userData._id;
    }
    return userData;
};

// Default Context Value
const defaultValue = {
    user: null,
    loading: true,
    login: () => { },
    logout: async () => { },
    handlegooglesignin: async () => { },
};

// Create Context
export const UserContext = createContext(defaultValue);

// Provider
export const UserProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(normalizeUser(JSON.parse(storedUser)));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        const normalizedUser = normalizeUser(userData);
        setUser(normalizedUser);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem("user");

        try {
            await signOut(auth);
        } catch (error) {
            console.log("Error:", error);
        }
    };

    const handlegooglesignin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);

            const firebaseUser = result.user;

            const payload = {
                email: firebaseUser.email,
                name: firebaseUser.displayName,
                image: firebaseUser.photoURL || DEFAULT_USER_IMAGE,
            };

            const response = await axiosInstance.post(
                "/user/login",
                payload
            );

            // Transform _id to id for frontend consistency
            const userData = response.data.result;
            if (userData._id) {
                userData.id = userData._id;
                delete userData._id;
            }

            login(userData);
        } catch (error) {
            console.error("Error during Google sign-in:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(
            async (firebaseUser) => {
                if (firebaseUser) {
                    try {
                        const payload = {
                            email: firebaseUser.email,
                            name: firebaseUser.displayName,
                            image:
                                firebaseUser.photoURL ||
                                DEFAULT_USER_IMAGE,
                        };

                        const response = await axiosInstance.post(
                            "/user/login",
                            payload
                        );

                        // Transform _id to id for frontend consistency
                        const userData = response.data.result;
                        if (userData._id) {
                            userData.id = userData._id;
                            delete userData._id;
                        }

                        login(userData);
                    } catch (error) {
                        console.log("Error: ", error);
                        logout();
                    }
                }
            }
        );

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                handlegooglesignin,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);








