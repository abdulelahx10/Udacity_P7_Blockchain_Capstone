var ERC721MintableComplete = artifacts.require("REToken");

contract("TestERC721Mintable", accounts => {

  const account_one = accounts[0];
  const account_two = accounts[1];
  const account_three = accounts[2];
  const account_four = accounts[3];

  describe("match erc721 spec", function() {

    beforeEach(async function() {

      this.contract = await ERC721MintableComplete.new({ from: account_one });

      // TODO: mint multiple tokens
      await this.contract.mint(account_two, 1, { from: account_one });
      await this.contract.mint(account_three, 2, { from: account_one });
      await this.contract.mint(account_four, 3, { from: account_one });
    });

    it("should return total supply", async function() {
      let total = await this.contract.totalSupply.call();
      const expectedTotal = 3;
      assert.equal(total.toNumber(), expectedTotal, `Total tokens expected to be ${expectedTotal}`);
    });

    it("should get token balance", async function() {
      let balance = await this.contract.balanceOf.call(account_two, { from: account_one})
      const expectedBalance = 1
      assert.equal(balance.toNumber(), expectedBalance, `balance expected to be ${expectedBalance}`);
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it("should return token uri", async function() {
      let _tokenURI = await this.contract.tokenURI.call(1, {from: account_one})
      const expectedTokenURI = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1'
      assert(_tokenURI == expectedTokenURI, `TokenURI should be ${expectedTokenURI}`);
    });

    it("should transfer token from one owner to another", async function() {
      const tokenId = 1
      await this.contract.approve(account_three, tokenId, { from: account_two })
      await this.contract.transferFrom(account_two, account_three, tokenId, {from: account_two})

      const newOwner = await this.contract.ownerOf.call(tokenId)
      assert.equal(newOwner, account_three, `Wrong owner`);
    })
  });

  describe("have ownership properties", function() {

    beforeEach(async function() {
      this.contract = await ERC721MintableComplete.new({ from: account_one });
    });

    it("should fail when minting when address is not contract owner", async function() {
      let failed = true
      try {
        await this.contract.mint(account_four, 20, { from: account_two })
      } catch (e) {
        failed = false
      }
      assert.equal(failed, false, 'Token minting should fail');
    });

    it("should return contract owner", async function() {
      let owner = await this.contract.owner.call({ from: account_one })
      assert.equal(owner, account_one, 'Wrong contract owner')
    });

  });

});
