import { useState } from "react";
import CurrencySelect from "./CurrencySelect";

const ConverterForm = () => {
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getExchangeRate = async () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    if (!API_KEY) {
      console.error("API key is missing");
      return;
    }
    const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}`;

    setIsLoading(true);

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Something went wrong!");

      const data = await response.json();
      const rate = (data.conversion_rate * amount).toFixed(2);
      setResult(`${amount} ${fromCurrency} = ${rate} ${toCurrency}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    getExchangeRate();
  };

  return (
    <div>
      <form className="converter_form" onSubmit={handleFormSubmit}>
        <div className="form_group">
          <label className="form_label">Enter Amount</label>
          <input
            type="number"
            className="form_input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="form_group form_currency_group">
          <div className="form_section">
            <label className="form_label">From</label>
            <CurrencySelect
              selectedCurrency={fromCurrency}
              handleCurrency={(e) => setFromCurrency(e.target.value)}
            />
          </div>

          <div className="swap_icon" onClick={handleSwapCurrencies}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              id="swap"
            >
              <path
                d="M13.98 22 6 30l7.98 8v-6H28v-4H13.98v-6zM42 18l-7.98-8v6H20v4h14.02v6L42 18z"
                fill="#fff"
              ></path>
            </svg>
          </div>

          <div className="form_section">
            <label className="form_label">To</label>
            <CurrencySelect
              selectedCurrency={toCurrency}
              handleCurrency={(e) => setToCurrency(e.target.value)}
            />
          </div>
        </div>
        <button className={` ${isLoading ? "loading" : ""} submit_button`}>
          Get Exchange Rate
        </button>
        <p className="exchange_rate_result">
          {isLoading ? "Getting Exchange rate..." : result}
        </p>
      </form>
    </div>
  );
};

export default ConverterForm;
