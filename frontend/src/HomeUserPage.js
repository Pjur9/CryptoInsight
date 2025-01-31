import React, { useState, useEffect } from 'react';
import './HomeUserPage.css'

const HomeUserPage = () => {
  const [userData, setUserData] = useState({});
  const [edit, setEdit] = useState(false);
  const [editCrypto, setEditCrypto] = useState(false);
  const [incomeValue, setIncomeValue] = useState(false)
  const [newData, setNewData] = useState({});
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');
  const [cryptoData, setCryptoData] = useState(null);
  const [cryptoData1, setCryptoData1] = useState(null);
  const [cryptoData2, setCryptoData2] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [cryptoValues, setCryptoValues] = useState(null);
  const [products, setProducts] = useState({});
  const [listOfDicts, setListOfDicts] = useState([]);
  const [ltc_price, setLtcPrice] = useState(null);
  const [btc_price, setBtcPrice] = useState(null);
  const [eth_price, setEthPrice]=useState(null);
  const [userProfit, setUserProfit] = useState({});
  const email_old = localStorage.getItem('user_email');
  useEffect(() => {
    // Function to fetch user data
    const storedUserData = localStorage.getItem('user_email');
    console.log(storedUserData)
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/userhome', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({storedUserData}),
    });
    if (response.ok) {
      const data = await response.json();
      setUserData(data);
     
    } else {
      console.error(`Failed to fetch user data. Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
    };

   
    fetchUserData();
  }, []); 

  

  const fetchDataHandle = () => {
    fetch(`http://localhost:5000/getBTC`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',      //json format saljemo
            },
            body: JSON.stringify(),   //body sadrzi podatke koje saljemo na server iz js u json kako bi bio prihvacen od serv
          })
          .then((res) => res.json())      //rukovanje odgovorom od servera
            .then((data) => {
              if (data.success) {
                const cryptoCurrency = data.crypto.pair.split(':')[0];
                const currentPrice = parseFloat(data.crypto.last);
                const timestamp = new Date(parseInt(data.crypto.timestamp) * 1000);

        setCryptoData({
          cryptoCurrency,
          currentPrice,
          timestamp,
        });

              } else {
               
              }
            })
            .catch((error) => {
              console.error('Error fetching crypto data:', error);
            });

    fetch('http://localhost:5000/getETH', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',      //json format saljemo
        },
        body: JSON.stringify(),
      })
      .then((res) => res.json())      //rukovanje odgovorom od servera
      .then((data) => {
        if (data.success) {
          console.log(data.crypto)
          const cryptoCurrency1 = data.crypto.pair.split(':')[0];
          const currentPrice1 = parseFloat(data.crypto.last);
          const timestamp1 = new Date(parseInt(data.crypto.timestamp) * 1000);
          setCryptoData1({
            cryptoCurrency1,
            currentPrice1,
            timestamp1,
          });
          } else {

          }
        })
        .catch((error) => {
          console.error('Error fetching crypto data:', error);
        });

        fetch('http://localhost:5000/getLTC', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',      //json format saljemo
          },
          body: JSON.stringify(),
        })
        .then((res) => res.json())      //rukovanje odgovorom od servera
        .then((data) => {
          if (data.success) {
            const cryptoCurrency2 = data.crypto.pair.split(':')[0];
            const currentPrice2 = parseFloat(data.crypto.last);
            const timestamp2 = new Date(parseInt(data.crypto.timestamp) * 1000);
            setCryptoData2({
              cryptoCurrency2,
              currentPrice2,
              timestamp2,
            });
            } else {
  
            }
          })
          .catch((error) => {
            console.error('Error fetching crypto data:', error);
          });
        }
  const handleEditClick = () => {
    setEdit(true);
  };

  const handleChange = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  }; 

  const closeHandle = () => {
    setCryptoData(null)
    setCryptoData1(null)
    setCryptoData2(null)
  };

  const handleCancelClick = () => {
    setEdit(false);
    setNewData({
      name: userData.name,
      surname: userData.surname,
      address: userData.address,
      city: userData.city,
      country: userData.country,
      phoneNumber: userData.phone_number,
      email: userData.email,
      password: '',
      newPassword: '',
    });
    console.log(userData.name);
  };

  const showHandle = () =>{
    fetch('http://localhost:5000/showCrypto',{
      method: 'POST',
            headers: {
              'Content-Type': 'application/json',      
            },
            body: JSON.stringify({email_old}),
    })
    .then((res) => res.json())     
      .then((data) => {
        if (data.success){
              setProducts(data.users)
              const list = Object.values(data.users);
              setListOfDicts(list);
              const counter = data.all_crypto;
              const bitcoin = data.btc_counter;
              const etherium = data.eth_counter;
              const litecoin = data.ltc_counter;
              setCryptoValues({
                counter,
                bitcoin,
                etherium,
                litecoin
              });
              setEditCrypto(true)
        }
        else {
          console.error("No crypto data\n");
        }
      })
      .catch((error) => {
        console.error('Error fetching crypto data:', error);
      });
      
          
  } 

  

  const handleUpdateClick = async () => {
    const data = {
      name:newData.name || userData.name,
      surname: newData.surname || userData.surname,
      address: newData.address || userData.address,
      city: newData.city || userData.city,
      country: newData.country || userData.country,
      phoneNumber:newData.phoneNumber || userData.phone_number,
      password: newData.password || '',
      newPassword: newData.newPassword || userData.password,
      oldEmail: email_old,
    };
    
    try {
      const response = await fetch('http://localhost:5000/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
      if (response.ok) {
        const new_data = await response.json();
        console.log("ovde je uslo");
        setUserData(new_data.user);
        setEdit(false);
      } else {
        const new_data = await response.json();
        setMessage(new_data.message);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const closeWalletHandle = () => {
      setEditCrypto(false)
  };

  const addNewTransaction = () => {
    fetch(`http://localhost:5000/addNewTransaction`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',      
            },
            body: JSON.stringify({email_old}),   
          })
          .then((res) => res.json())      
            .then((data) => {
              if (data.success) {
                console.log(data.message);
                window.location.href = '/addTransaction'
              } else {
                console.log(data.message);
              }
            })
            .catch((error) => {
              console.error('Error fetching crypto data:', error);
            });
  }

  const deleteHandle = (item)  => {
    
    fetch('http://localhost:5000/deleteTransaction',{
      method: 'POST',
            headers: {
              'Content-Type': 'application/json',      //json format saljemo
            },
            body: JSON.stringify({item}),
    })
    .then((res)=> res.json())                       
    .then((data)=>{
      if(data.success){
        
       showHandle() 
       profitHandle()

    }else{
      console.error("No crypto data to callculate\n");
    }
    })
    .catch((error) => {
      console.error('Error fetching crypto data:', error);
    });
  }
   ///////////////////////////////////////////////////////////////////////////// 
   const profitHandle = () =>{
    fetch('http://localhost:5000/calculateProfit',{
      method: 'POST',
            headers: {
              'Content-Type': 'application/json',      //json format saljemo
            },
            body: JSON.stringify({email_old}),
    })
    .then((res)=> res.json())                       
    .then((data)=>{
      if(data.success){
      console.log("USAO OVDE");
      setUserProfit(data);
      setIncomeValue(true)
    }else{
      console.error("No crypto data to callculate\n");
    }
    })
    .catch((error) => {
      console.error('Error fetching crypto data:', error);
    });
  }

  const CloseBilansHandle = () => {
    setIncomeValue(false)
  }

 //////////////////////////////////////////////////////////////////////////// 
  


  return (
    <div>
      <h1 className='dobrodosli' >Dobrodošli u vaš Kripto Portfolio!</h1>
      {userData ? (
        <div className='ispis'>
          <p className='user-name'>Name: {userData.name}</p>
          <p className='user-surname'>Surname: {userData.surname}</p>
          <p className='user-email'>Email: {userData.email}</p>
          <button className='izmijeni' onClick={handleEditClick}>Izmjeni</button>
          <button className='look' onClick={fetchDataHandle}>Look at crypto currency values live</button>
          <button className='show-transaction' onClick={showHandle}>Show transactions</button>
          <button className='financials'  onClick={profitHandle}>Show financials</button>
          <button className='add-new' onClick={addNewTransaction}>Add new transaction</button>
        </div>
        
      ) : (
        <p>Loading user data...</p>
      )}
   
    {
      edit && (
        <form className='update-form'> 
        <table className='table' >
          <tbody>
            <tr>
              <td><label className='ime'>Ime:
              <input className='input-ime'
                type='text'
                name='name'
                value={newData.name || userData.name}
                onChange={handleChange}
              /></label></td>
            </tr>
            <tr>
              <td><label className='prezime'>Prezime:
              <input className='input-prezime'
                type='text'
                name='surname'
                value={newData.surname || userData.surname} 
                onChange={handleChange}
                /></label></td>
            </tr>
            <tr>
              <td>
            <label className='adresa'>
              Adresa:
              <input className='input-adresa'
                type='text'
                name='address'
                value={newData.address || userData.address}
                onChange={handleChange}
              />
              </label>
              </td>
            </tr>
            <tr>
              <td><label className='grad'>Grad:
              <input className='input-grad'
                type='text'
                name='city'
                value={newData.city ||userData.city}
                onChange={handleChange}
              /></label></td>
            </tr>
            <tr>
              <td><label className='drzava'>Država:
              <input className='input-drzava'
                type='text'
                name='country'
                value={newData.country || userData.country}
                onChange={handleChange}
              /></label></td>
            </tr>
            <tr>
              <td><label className='brojtelefona'>Broj telefona:
              <input className='input-brtel'
                type='text'
                name='phoneNumber'
                value={newData.phoneNumber || userData.phone_number}
                onChange={handleChange}
              /></label></td>
            </tr>
            <tr>
              <td><label className='lozinka'>Lozinka:
              <input className='input-loznika'
                type='password'
                name='password'
                value={newData.password || ''}
                onChange={handleChange}
              /></label></td>
            </tr>
            <tr>
              <td><label className='nova-lozinka'>Nova lozinka:
              <input className='input-nova'
                type='password'
                name='newPassword'
                value={newData.newPassword || ''}
                onChange={handleChange}
              /></label></td>
            </tr>
          </tbody>
        </table>
        <p>
  <button className='odustani' type='button' onClick={handleCancelClick}>ODUSTANI</button>
  <button className='izmeni' type='button' onClick={handleUpdateClick}>IZMENI</button>
  </p>
     </form> 
      )
    }
    <div className='cryptoo'>
      
      {cryptoData && (
        
        <table className='valute'>
          <thead>
            <tr>
              <th className='currency'>Crypto Currency</th>
              <th className='price'>Current Price</th>
              <th className='timestamp'>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{cryptoData.cryptoCurrency}</td>
              <td>{cryptoData.currentPrice}</td>
              <td>{cryptoData.timestamp.toString()}</td>
            </tr>
            
          </tbody>
        </table>
      )}
    </div>
    <div>
      {cryptoData1 && (
        <table className='valute'>
          <thead>
            <tr>
              <th className='currency'>Crypto Currency</th>
              <th className='price' >Current Price</th>
              <th className='timestamp'>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{cryptoData1.cryptoCurrency1}</td>
              <td>{cryptoData1.currentPrice1}</td>
              <td>{cryptoData1.timestamp1.toString()}</td>
            </tr>
          </tbody>
          
        </table>
      )}
    </div>
    <div>
      {cryptoData2 && (
        <table className='valute'>
          <thead>
            <tr>
              <th className='currency'>Crypto Currency</th>
              <th className='price'>Current Price</th>
              <th className='timestamp'>Timestamp</th>
             
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{cryptoData2.cryptoCurrency2}</td>
              <td>{cryptoData2.currentPrice2}</td>
              <td>{cryptoData2.timestamp2.toString()}</td>
            </tr>
          </tbody>
          <td>

          </td>
          <button className='close' onClick={closeHandle}>Close</button>
        </table>
        
      )}
    </div>
   
    <div>
    {editCrypto && (
<table className='prikaz'>
  <thead>
  <tr className='red'>
  <th className='cc'>Crypto Currency</th>
  <th className='ppp'>price_per_coin</th>
  <th className='tm'>Time</th>
  <th className='vot'>Value of transaction</th>
  <th className='tt'>Transaction type</th>
  <th className='quant'>Quantity</th>
   </tr>
  </thead>
      <tbody>
      {listOfDicts.map((item, index) => (
          <tr key={index}>
           <td className='itemc'>{item.currency}</td>
           <td className='itemppp'>{item.price_per_coin}</td>
           <td className='itemtm'>{item.time}</td>
           <td className='itemp'>{item.price}</td>
           <td className='itemtt'>{item.transaction_type}</td>
           <td className='itemq'>{item.quantity}</td>
           <td className='butt'><button className='delete' onClick={() =>deleteHandle(item.time)}>Delete transaction</button></td>
          </tr>
        ))}
      </tbody>
      </table>
    )}
    </div>
    <div>
    {editCrypto && (
      <table className='editcrypto'>
        <thead>
          <th className='allcrypto'>ALL crypto</th>
          <th className='BTC'>BTC</th>
          <th className='ETH'>ETH</th>
          <th className='LTC'>LTC</th>
        </thead>
        <tbody>
        {cryptoValues && (
      <tr>
        <td>{cryptoValues.counter}</td>
        <td>{cryptoValues.bitcoin}</td>
        <td>{cryptoValues.etherium}</td>
        <td>{cryptoValues.litecoin}</td>
      </tr>
      )}
      <tr>
        <td><button className='close' onClick={closeWalletHandle}>Close wallet</button></td>
      </tr>
        </tbody>
      </table>
    )}
    </div>
    <div>
    {incomeValue && (
              <table className='profit total'>
                <thead>
                  <tr>
                    <th className='currname'>Currency name</th>
                    <th className='profit'>Profit </th>
                    <th className='total'>Total currency value(live)</th>
                  </tr>
                </thead>
                <tr>
                  <td className='BTC'>BTC</td>
                  <td>{userProfit.bilansBTC}</td>
                  <td>{userProfit.valueBTC}</td>
                  </tr>
                  <tr>
                  <td className='ETH'>ETH</td>
                  <td>{userProfit.bilansETH}</td>
                  <td>{userProfit.valueETH}</td>
                  </tr>
                  <tr>
                  <td className='LTC'>LTC</td>
                  <td>{userProfit.bilansLTC}</td>
                  <td>{userProfit.valueLTC}</td>
                  </tr>
                  <tr>
                    <td className='prikaz-wallet'>Prikaz za wallet +/- :</td>
                    <td>{userProfit.bilans}</td>
                  </tr>
                  <tr>
                    <td className='ukupna-vrednost'>Ukupna vrijednost walleta:</td>
                    <td>{userProfit.value}</td>
                  </tr>
                <tr><td><button className='close-bilans' onClick={CloseBilansHandle}>Close bilans</button></td></tr>
              </table>
    )}

      </div>
   
    </div>
    
    
  );
};
export default HomeUserPage;
