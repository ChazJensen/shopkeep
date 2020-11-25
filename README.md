# Shopkeep

### A Discord Bot

shopkeep is a currency and inventory tracker with a bit of added functionality


---


### TODO

- [x] backend rewrite
- [x] USE FileHandle class from `fs`
- bot features to implement:
  - [x] set points
    - [x] add points
    - [x] subtract points
  - [ ] shop
    - [ ] creation
    - [ ] management
      - [ ] add/remove item for sale
      - [ ] pricing items
      - [ ] [VOTE_ON] stock: infinite or is there a supply chain?
        - [ ] supply chain would be run by NPCs that you pay for stock
	- decision: 
    - [ ] "selling"
  - [ ] inventory
- boiler plate code for
  - [x] codeblock
  - [x] delay-delete messages (oneliner???)
  * row-to-codeblock parser


---


### Installation

TODO: write out steps for creating a discord bot
TODO: write out steps for storing token

Shopkeep uses discord.js. Once you clone the repo, run

```
npm install discord.js
```

Afterwards, in order to start Shopkeep, run `make`, or `node app`.
If you get errors regarding certain folders not being created, ensure
the following folders exist:

- commands
- data
- lib
- node_modules

Create an issue if you are having trouble with this.


---


### Changelog:

**v0.0.5**: debug mode turned off; can be used for its basic function: points. A few crumbs left for future implementation

**v0.0.4**: boilerplate code in the frontend has been abstracted for readability

**v0.0.3**: bot awards a user a point for each message they send

**v0.0.2**: backend rewritten for readability and efficiency

**v0.0.1**: added modes: debug and chatlogger

**v0.0.0**: basic currency tracker--based on messages sent


### Contributors

[ChazJensen](github.com/ChazJensen)
