import { useSearchParams } from 'react-router-dom';
import axios from "axios";
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../config";

export const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false); 
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const handleSendMoney = async () => {
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/api/v1/account/transfer`, {
                to: id,
                amount
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            enqueueSnackbar("Money sent successfully!", { variant: "success" });
            navigate("/dashboard");
        } catch (error) {
            enqueueSnackbar("Failed to send money. Please try again.", { variant: "error" });
            console.error("Send money failed", error);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className="flex flex-col justify-center h-full">
                <div className="max-w-md p-4 space-y-8 bg-white border rounded-lg shadow-lg h-min text-card-foreground w-96">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h2 className="text-3xl font-bold text-center">Send Money</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full">
                                <span className="text-2xl text-white">{name[0].toUpperCase()}</span>
                            </div>
                            <h3 className="text-2xl font-semibold">{name}</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="amount"
                                >
                                    Amount (in Rs)
                                </label>
                                <input
                                    onChange={(e) => setAmount(e.target.value)}
                                    type="number"
                                    className="flex w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background"
                                    id="amount"
                                    placeholder="Enter amount"
                                />
                            </div>
                            <button 
                                onClick={handleSendMoney} 
                                className={`justify-center w-full h-10 px-4 py-2 text-sm font-medium text-white transition-colors rounded-md ring-offset-background ${loading ? 'bg-gray-400' : 'bg-green-500'}`}
                                disabled={loading} 
                            >
                                {loading ? "Processing..." : "Initiate Transfer"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
