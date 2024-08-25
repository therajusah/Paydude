import { useEffect, useState } from "react";
import axios from "axios";
import { Appbar } from "../Components/Appbar";
import { Balance } from "../Components/Balance";
import { Users } from "../Components/Users";
import { API_BASE_URL } from "../config";

export const Dashboard = () => {
    const [balance, setBalance] = useState(null);

    const getBalance = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/account/balance`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            setBalance(response.data.balance);
        } catch (error) {
            console.log("Error in getting Balance", error);
        }
    };

    useEffect(() => {
        getBalance();
    }, []);

    return (
        <div>
            <Appbar />
            <div className="m-8">
                <Balance value={balance !== null ? balance.toFixed(2) : "Loading..."} />
                <Users />
            </div>
        </div>
    );
};
