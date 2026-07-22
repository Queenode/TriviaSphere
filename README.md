# 🌐 TriviaSphere

**TriviaSphere** is a next-generation 3D Web3 Trivia Game built for the Celo blockchain. Step into an immersive 3D virtual gameshow studio—complete with suspenseful audio, dynamic lighting, and a fully interactive environment. Test your knowledge, use lifelines, climb the prize ladder, and mint exclusive **Soulbound NFT Badges** directly on the Celo Mainnet as you reach key milestones!

![TriviaSphere Screenshot](frontend/public/favicon.ico) <!-- You can update this to an actual game screenshot later -->

## 🚀 Features

- **Immersive 3D Experience**: Powered by React Three Fiber and Three.js, featuring a custom studio environment with seated animated mannequins (Host and Player).
- **Web3 Integration**: Seamless onboarding and wallet management via **Privy**, completely abstracted away from the user for a smooth Web2-like experience.
- **On-chain Soulbound Badges**: Progressing to Levels 5, 10, and 15 triggers a smart contract interaction, minting an untransferable, verifiable achievement badge on the Celo Mainnet.
- **Classic Gameplay**: 15 progressive questions with high stakes!
- **Lifelines**: 
  - 🎭 **50:50**: Removes two incorrect answers.
  - 📞 **Phone a Friend**: Simulates a call for help.
  - 👥 **Ask the Audience**: Generates simulated audience poll results.
- **Atmospheric Audio**: Suspenseful background music, sound effects, and a Text-to-Speech (TTS) engine that dynamically reads out the questions.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (React)
- **3D Rendering**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) (R3F) & Drei
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Web3 Auth**: [Privy](https://www.privy.io/)
- **Blockchain Interaction**: [wagmi](https://wagmi.sh/) & [viem](https://viem.sh/)

### Smart Contract
- **Language**: Solidity (^0.8.20)
- **Framework**: [Hardhat](https://hardhat.org/)
- **Libraries**: [OpenZeppelin](https://www.openzeppelin.com/) (ERC721, URIStorage)
- **Network**: [Celo Mainnet](https://celo.org/)

## 📜 Smart Contract

The core of the game's reward mechanism is the `TriviaSphereBadge` smart contract.

- **Network**: Celo Mainnet
- **Contract Address**: [`0x73A60E0e1eF9f5Faa78C703AF413Cae15c3Be171`](https://celoscan.io/address/0x73A60E0e1eF9f5Faa78C703AF413Cae15c3Be171)
- **Type**: Soulbound Token (SBT) / Non-transferable ERC721

Badges are minted with dynamic URIs corresponding to the milestone achieved (Level 5, 10, or 15).

## 💻 Running the Project Locally

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Privy App ID (from the Privy Dashboard)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/triviasphere.git
cd triviasphere
```

### 2. Setup the Frontend
```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory and add your Privy credentials:
```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the game in your browser.

### 3. Setup the Smart Contract (Optional)
If you wish to deploy your own version of the badge contract or run local tests:

```bash
cd smartcontract
npm install
```

Create a `.env` file in the `smartcontract` directory:
```env
PRIVATE_KEY=your_wallet_private_key
```

To compile and deploy to Celo Mainnet:
```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network celo
```

## 🎮 How to Play
1. Connect your wallet or sign in using email/socials via the **Privy** modal on the landing page.
2. Click **Start Game** to enter the 3D studio.
3. Listen to the host and answer the multiple-choice questions.
4. Use the Lifeline buttons at the top right if you get stuck!
5. Reach milestones (Level 5, 10, 15) to mint your Soulbound NFT badges.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/triviasphere/issues).

## 📄 License
This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
