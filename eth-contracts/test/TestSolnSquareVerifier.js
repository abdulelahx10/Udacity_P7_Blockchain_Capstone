const Verifier = artifacts.require('Verifier')
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier')

const proof = require('../../zokrates/code/square/proof')

contract('TestSolnSquareVerifier', accounts => {
    const account_one = accounts[0]
    const account_two = accounts[1]

    beforeEach(async function () {
        const _Verifier = await Verifier.new({
            from: account_one
        })
        this.contract = await SolnSquareVerifier.new(_Verifier.address, {
            from: account_one
        })
    })

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it('A new solution can be added', async function () {
        let solutionAdded = true
        try {
            await this.contract.addSolution(
                account_two,
                2,
                '0x6c34c7966a560cc2064042eb67888a1f172b38749f6e321857c0efead486bbe5', {
                    from: account_one
                }
            )
        } catch (e) {
            solutionAdded = false
        }
        assert.equal(solutionAdded, true, 'Solution should have been added')
    })

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it('An ERC721 token can be minted', async function () {
        let tokenMinted = true
        try {
            await this.contract.mintToken(
                account_two,
                14,
                proof.proof.a,
                proof.proof.b,
                proof.proof.c,
                proof.inputs, {
                    from: account_one
                }
            )
        } catch (e) {
            tokenMinted = false
        }

        assert.equal(tokenMinted, true, 'Token should be minted')
    })
})