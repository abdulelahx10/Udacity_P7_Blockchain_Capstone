const HDWalletProvider = require("truffle-hdwallet-provider")
const web3 = require('web3')

const proofs = require('../zokrates/code/square/proofs')
const abi = require('../eth-contracts/build/contracts/SolnSquareVerifier').abi

const MNEMONIC = 'escape monitor human resist believe ankle unlock love sheriff dinosaur penalty prepare'
const INFURA_KEY = '235332a9f9e748dbbaf923561c2d8565'
const CONTRACT_ADDRESS = '0xa9B128a646666028F311C266e854AeFE69A0cf8e'
const OWNER_ADDRESS = '0x8Cf2E8665564B6781E8f88ae1606059A16Bc0C22'
const TO_MINT_ADDRESS = '0xD47eBDEf1e11Ce5c2e9134b4E9Fd67aA6fB18B00'
const NETWORK = 'rinkeby'
const NUM_TOKENS = 5

if (!MNEMONIC || !INFURA_KEY || !OWNER_ADDRESS || !NETWORK) {
    console.error("Please set a mnemonic, infura key, owner, network, and contract address.")
    return
}

async function main() {
    const provider = new HDWalletProvider(MNEMONIC, `https://${NETWORK}.infura.io/v3/${INFURA_KEY}`)
    const web3Instance = new web3(
        provider
    )

    if (CONTRACT_ADDRESS) {
        const nftContract = new web3Instance.eth.Contract(abi, CONTRACT_ADDRESS, { gasLimit: "1000000" })

        // Creatures issued directly to the owner.
        for (var i = 0; i < NUM_TOKENS; i++) {
            let proof = proofs[i].proof
            let input = proofs[i].inputs
            // console.log('proof', proof);
            // console.log('input', input);
            
            

            try {
                const result = await nftContract.methods.mintToken(
                    OWNER_ADDRESS,
                    i+1,
                    proof.a,
                    proof.b,
                    proof.c,
                    input
                    ).send({ from: OWNER_ADDRESS });
                console.log("Minted token. Transaction: " + result.transactionHash)
                
            } catch (error) {
                // console.log(error)
                console.log("Error Minting.")
            }
        }
    }
}

main()