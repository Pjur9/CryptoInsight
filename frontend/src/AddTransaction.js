import React, { useState, useEffect } from 'react';
 
const AddTransaction = () => {
   
    const [showModal, setShowModal] = useState(false);     
    const [transactionType, setTransactionType] = useState('');    
    const [currencyName, setCurrencyName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [pricePerCoin, setPricePerCoin] = useState('');
    const [date, setDate] = useState('');
    const [totalReceived, setTotalReceived] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const email = localStorage.getItem('user_email');
   
    const handleAddTransaction = () => {
        setShowModal(true);
      };

      
    
    const BuyHandle = () => {
      
      const text = 'kupovina'
      const transactionData = {
        text,
        currencyName,
        quantity,
        pricePerCoin,
        date,
        totalReceived,
        email
      };
      fetch(`http://localhost:5000/kupovina`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',    
            },
            body: JSON.stringify(transactionData),   
          })
            .then((res) => res.json())      
            .then((data) => {
              if (data.success) {
                console.log('Transakcija uspešno sačuvana');
                setShowModal(false);
                setCurrencyName('');
                setQuantity('');
                setPricePerCoin('');
                setDate('');
                setTotalReceived('');
              } else {
                setErrorMessage(data.message)
                
              }
            })
            .catch((error) => {
              console.error('Greška prilikom slanja zahteva:', error);
            });
    }
 
    const SellHandle = () => {
      const text = 'prodaja'
      const transactionData = {
        text,
        currencyName,
        quantity,
        pricePerCoin,
        date,
        totalReceived,
        email
      };
      fetch(`http://localhost:5000/prodaja`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',    
            },
            body: JSON.stringify(transactionData),   
          })
            .then((res) => res.json())      
            .then((data) => {
              if (data.success) {
                console.log('Transakcija uspešno sačuvana');
                setShowModal(false);
                setCurrencyName('');
                setQuantity('');
                setPricePerCoin('');
                setDate('');
                setTotalReceived('');
              } else {
                setErrorMessage(data.message)
               
              }
            })
            .catch((error) => {
              console.error('Greška prilikom slanja zahteva:', error);
            });
    }
 
  
 
        useEffect(() => {
          // Implementirajte logiku za izračunavanje ukupno primljene vrednosti
          const total = parseFloat(quantity) * parseFloat(pricePerCoin);
          setTotalReceived(total.toFixed(2));
        }, [quantity, pricePerCoin]);
 
        return (
            <div className='transaction'>
              <button className='addtr' onClick={handleAddTransaction}>Add Transaction</button>
              {showModal && (
                <div className='show'>
                  <form className='transakcija'>
                    <label className='currencyname'>Currency Name:</label>
                    <input className='inputname'
                      type="text"
                      value={currencyName}
                      onChange={(e) => setCurrencyName(e.target.value)}
                    />
 
                    <label className='quantity'>Quantity:</label>
                    <input className='inputquantity'
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
 
                    <label className='price'>Price per Coin:</label>
                    <input className='inputprice'
                      type="text"
                      value={pricePerCoin}
                      onChange={(e) => setPricePerCoin(e.target.value)}
                    />
 
                    <label className='date'>Date:</label>
                    <input className='inputdate'
                      type="datetime-local"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
 
                    <label className='total'>Total Received:</label>
                    <input className='inputtotal'
                      type="text"
                      value={totalReceived}
                      readOnly
                    />
                  </form>
                  {errorMessage && <p className="error-message">{errorMessage}</p>}
                  <div>
                <button className='kupovina' onClick={BuyHandle}>Kupovina</button>
                <button className='prodaja' onClick={SellHandle}>Prodaja</button>
              </div>
                </div>
                
              )}
              <button className='anotherpage' onClick={() => window.location.href = '/userhome'}>Go back</button>
            </div>
          );
        };
 
export default AddTransaction;