# CEI API 💸

API to collect data from Canal Eletrônico do Investidor ([CEI](https://cei.b3.com.br/)) using [cei-crawler](https://github.com/Menighin/cei-crawler).

### Technologies

This project was developed with the following technologies:

- [Node.js][nodejs]
- [TypeScript][typescript]

### Installation

```bash
# Clone this repository
$ git clone https://github.com/barbosagabriel/cei-api

# Go into the repository
$ cd cei-api

# Install dependencies
$ npm install

# Run migrations
$ npm knex:migrate

# Start server *
$ npm run dev

# running on port 3333 (default)
```

\*Before start the server, rename .envexample to .env and edit the environment variables

### Usage

First, make a request to create a token informing your username (CPF) and password.
Then, use this token as query parameter for any other request.

#### Create a token

**URL:** /token

**Method:** `POST`

**Request Body:** `{ "username": "Your CPF (only numbers)", "password": "Your Password"}`

**Responses:**

Code: 201 | Content: `{ "token": "978434061356194" }`

Code: 500 | Content: `{ "error": "Detailed error" }`

#### Get wallet

**URL:** /wallet

**Method:** `GET`

**Query Parameter:** `token=978434061356194`

**Responses:**

Code: 200 | Content:

```
[
  {
    "institution": "308 - CLEAR CORRETORA - GRUPO XP",
    "account": "12345",
    "stockWallet": [
      {
        "company": "BRADESCO",
        "stockType": "PN N1",
        "code": "BBDC4",
        "isin": "BRBBDCACNPR8",
        "price": 21.16,
        "quantity": 170,
        "quotationFactor": 1,
        "totalValue": 3597.2
      },
      {
        "company": "FII CSHG LOG",
        "stockType": "CI ER",
        "code": "HGLG11",
        "isin": "BRHGLGCTF004",
        "price": 190,
        "quantity": 18,
        "quotationFactor": 1,
        "totalValue": 3420
      }
    ],
    "nationalTreasuryWallet": []
  },
  {
    "institution": "90 - EASYNVEST - TITULO CV S.A.",
    "account": "515151",
    "stockWallet": [],
    "nationalTreasuryWallet": [
      {
        "code": "Tesouro Selic 2023",
        "expirationDate": "2023-03-01T03:00:00.000Z",
        "investedValue": 30077.34,
        "grossValue": 34604.23,
        "netValue": 33924.28,
        "quantity": 3.25,
        "blocked": 0
      }
    ]
  }
]
```

Code: 401 | Content: `{ "error": "Invalid token" }`

Code: 500 | Content: `{ "error": "Detailed error" }`

#### Get dividends

**URL:** /dividends

**Method:** `GET`

**Query Parameter:** `token=978434061356194`

**Responses:**

Code: 200 | Content:

```
[
  {
    "stockType": "PN N1",
    "code": "BBDC4",
    "date": "2020-08-03T03:00:00.000Z",
    "type": "JUROS SOBRE CAPITAL PRÓPRIO",
    "quantity": 170,
    "factor": 1,
    "grossValue": 3.22,
    "netValue": 2.74
  },
  {
    "stockType": "CI",
    "code": "HGLG11",
    "date": "2020-07-14T03:00:00.000Z",
    "type": "RENDIMENTO",
    "quantity": 18,
    "factor": 1,
    "grossValue": 14.04,
    "netValue": 14.04
  },
  {
    "stockType": "PN N1",
    "code": "BBDC4",
    "date": "2020-07-01T03:00:00.000Z",
    "type": "JUROS SOBRE CAPITAL PRÓPRIO",
    "quantity": 132,
    "factor": 1,
    "grossValue": 2.5,
    "netValue": 2.13
  }
]
```

Code: 401 | Content: `{ "error": "Invalid token" }`

Code: 500 | Content: `{ "error": "Detailed error" }`

#### Get stock history transactions

**URL:** /transactions

**Method:** `GET`

**Query Parameters:** `token=978434061356194`, `startDate=MM/DD/YYYY` (optional), `endDate=MM/DD/YYYY` (optional)

**Responses:**

Code: 200 | Content:

```
[
  {
    "institution": "308 - CLEAR CORRETORA - GRUPO XP",
    "account": "95419",
    "stockHistory": [
      {
        "date": "2020-03-09T03:00:00.000Z",
        "operation": "C",
        "market": "Merc. Fracionário",
        "expiration": "",
        "code": "BBDC4F",
        "name": "BRADESCO PN EJ N1",
        "quantity": 20,
        "price": 26.53,
        "totalValue": 530.6,
        "quotationFactor": 1
      },
      {
        "date": "2020-03-09T03:00:00.000Z",
        "operation": "C",
        "market": "Mercado a Vista",
        "expiration": "",
        "code": "HGLG11",
        "name": "FII CSHG LOGCI ER",
        "quantity": 1,
        "price": 168.99,
        "totalValue": 168.99,
        "quotationFactor": 1
      },
    ]
]
```

Code: 401 | Content: `{ "error": "Invalid token" }`

Code: 500 | Content: `{ "error": "Detailed error" }`

### Credits

Thanks to João Menighin that made a great job on the web crawler to collect all data from CEI.

Check out his repository [here](https://github.com/Menighin/cei-crawler).

[nodejs]: https://nodejs.org/
[typescript]: https://www.typescriptlang.org/
