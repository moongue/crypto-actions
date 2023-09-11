# Crypto-actions
___
Library of scripts for automating crypto actions like withdraws from CEX and smart-contract interactions.\
Best scripts for drophunters. Soon script will have more features.

## Installation
___
1. Install [nodejs](https://nodejs.org/en) 
2. Open terminal in your folder when you want to install this library and run command:\
    ```git clone https://github.com/cli/cli.git``` \
    If you don't have git on your machine you can download archive from [here](https://github.com/moongue/crypto-actions/archive/refs/heads/main.zip)
3. Open terminal in folder with library and run command:\
    ```npm install```

## Usage
___
**Script features**:
1. Withdraws to multiple addresses.\
   Script supports Binance, OKX, MEXC exchanges.
   If you need to withdraw from any of this exchanges you need to create .env file in root folder of library and add this lines(**YOU NEED TO ADD ONLY EXCHANGES THAT YOU WANT TO USE**):
    ```
    BINANCE_API_KEY={your binance api key}
    BINANCE_SECRET_KEY={your binance secret key}
    MEXC_API_KEY={your mexc api key}
    MEXC_SECRET_KEY={your mexc secret key}
    OKX_API_KEY={your okx api key}
    OKX_SECRET_KEY={your okx secret key}
    OKX_API_PASS={your okx api password}
    ```
   All API configuration you can find here [Binance](https://www.binance.com/en/my/settings/api-management), [OKX](https://www.okx.com/account/my-api), [MEXC](https://www.mexc.com/user/openapi)
   I highly recommend to add IP address of your computer while creating API keys.\
   How to get IP address? Run this command in terminal
   - MacOS: ```curl ifconfig.me```
   - Windows: ```ipconfig```

## Run script ```npm start```

## Withdraws
___
1. Select a client from the list. Before you must add appropriate API keys to .env file.
   User arrows to navigate and press ```Enter``` to select.
   
2. Write a path to file with addresses separated by comma.\
   You can create file in the root directory of script.
   
   Example ```addresses.txt```: 
   
   ```
   0x1234, 
   0x1234, 
   0x1234,
   ```
   As answer write a path to the file ```./addresses.txt```
3. Write an interval between withdraws in seconds.\
   Example ```100```
4. Write a coin name.\
   Example ```ETH```
5. Write a network name. **Name of some networks in different CEX can be different.**\
   Example ```ERC20``` or ```ETH```
6. Write amount of coins to withdraw.\
   Example ```0.1``` orr it can be range ```0.1-0.5```
7. Confirm your withdraws.\
   Example ```Y``` or ```n```






