import {
  ChainId,
  useClaimedNFTSupply,
  useContractMetadata,
  useNetwork,
  useNFTDrop,
  useDisconnect,
  useUnclaimedNFTSupply,
  useActiveClaimCondition,
  useClaimNFT,
  useWalletConnect,
  useCoinbaseWallet,
} from '@thirdweb-dev/react';
import { useNetworkMismatch } from '@thirdweb-dev/react';
import { useAddress, useMetamask } from '@thirdweb-dev/react';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import type { NextPage } from 'next';
import { useState } from 'react';
import styles from '../styles/Theme.module.css';

// Put Your NFT Drop Contract address from the dashboard here
const myNftDropContractAddress = '0x7816747AF2f499eb64196ec3580eAFb37044f686';

const Home: NextPage = () => {
  const nftDrop = useNFTDrop(myNftDropContractAddress);
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  const isOnWrongNetwork = useNetworkMismatch();
  const claimNFT = useClaimNFT(nftDrop);
  const [, switchNetwork] = useNetwork();

  // The amount the user claims
  const [quantity, setQuantity] = useState(1); // default to 1

  // Load contract metadata
  const { data: contractMetadata } = useContractMetadata(
    myNftDropContractAddress,
  );

  // Load claimed supply and unclaimed supply
  const { data: unclaimedSupply } = useUnclaimedNFTSupply(nftDrop);
  const { data: claimedSupply } = useClaimedNFTSupply(nftDrop);

  // Load the active claim condition
  const { data: activeClaimCondition } = useActiveClaimCondition(nftDrop);

  // Check if there's NFTs left on the active claim phase
  const isNotReady =
    activeClaimCondition &&
    parseInt(activeClaimCondition?.availableSupply) === 0;

  // Check if there's any NFTs left
  const isSoldOut = unclaimedSupply?.toNumber() === 0;

  // Check price
  const price = parseUnits(
    activeClaimCondition?.currencyMetadata.displayValue || '0',
    activeClaimCondition?.currencyMetadata.decimals,
  );

  // Multiply depending on quantity
  const priceToMint = price.mul(quantity);

  // Loading state while we fetch the metadata
  if (!nftDrop || !contractMetadata) {
    return <div className={styles.container}>Loading...</div>;
  }

  // Function to mint/claim an NFT
  const mint = async () => {
    if (isOnWrongNetwork) {
      switchNetwork && switchNetwork(ChainId.Goerli);
      return;
    }

    claimNFT.mutate(
      { to: address as string, quantity },
      {
        onSuccess: () => {
          alert(`Successfully minted NFT${quantity > 1 ? 's' : ''}!`);
        },
        onError: (err: any) => {
          console.error(err);
          alert(err?.message || 'Something went wrong');
        },
      },
    );
  };

  return (
    <>
    <div className="relative w-full h-full pb-10">
      <div className="hidden md:block">
          <img
            className="absolute bg-cover bg-center w-full h-full inset-0"
            src="https://i.ibb.co/CbGH732/Background-3.webp"
            alt=""
            />
      </div>
      <nav className="lg:hidden relative z-50">
          <div className="flex py-2 justify-between items-center px-4">
            <div>
                <img
                  src="https://svgur.com/i/mXJ.svg"
                  alt="logo"
                  />
            </div>
            <div className="visible flex items-center">
                <button
                  id="open"
                  className="focus:outline-none focus:ring-2 focus:ring-black"
                  >
                <img
                  src="https://tuk-cdn.s3.amazonaws.com/can-uploader/large_typography_with_gradient_and_glass_effect_Svg2.svg"
                  alt="menu"
                  />
                </button>
                <ul
                  id="list"
                  className="hidden p-2 border-r bg-white absolute rounded top-0 left-0 right-0 shadow mt-24"
                  >
                  <li className="flex cursor-pointer text-gray-600 text-sm leading-3 tracking-normal mt-2 py-2 hover:text-blue-700 focus:text-blue-700 focus:outline-none">
                      <a
                        href="#home"
                        className="ml-2 focus:outline-none focus:ring-2 focus:ring-black"
                        >
                      <span className="font-bold">Home</span>
                      </a>
                  </li>
                  <li
                      className="flex cursor-pointer text-gray-600 text-sm leading-3 tracking-normal py-2 hover:text-blue-700 focus:text-blue-700 focus:outline-none"
                      >
                      <a
                        href="#about"
                        className="ml-2 focus:outline-none focus:ring-2 focus:ring-black"
                        >
                      <span className="font-bold">About</span>
                      </a>
                  </li>
                  <li className="flex cursor-pointer text-gray-600 text-sm leading-3 tracking-normal py-2 hover:text-blue-700 flex items-center focus:text-blue-700 focus:outline-none">
                      <a
                        href="#Donate"
                        className="ml-2 focus:outline-none focus:ring-2 focus:ring-black"
                        >
                      <span className="font-bold">Donate</span>
                      </a>
                  </li>
                  <li
                      className="flex cursor-pointer text-gray-600 text-sm leading-3 tracking-normal pt-2 pb-4 hover:text-blue-700 focus:text-blue-700 focus:outline-none"
                      >
                      <a
                        href="javascript: void(0)"
                        className="ml-2 focus:outline-none focus:ring-2 focus:ring-black"
                        >
                      <span className="font-bold">Connect Wallet</span>
                      </a>
                  </li>
                </ul>
                <div className="xl:hidden">
                  <button
                      id="close"
                      className="hidden close-m-menu focus:ring-2 focus:ring-black focus:outline-none"
                      >
                  <img
                      src="https://tuk-cdn.s3.amazonaws.com/can-uploader/large_typography_with_gradient_and_glass_effect_Svg3.svg"
                      alt="close"
                      />
                  </button>
                </div>
            </div>
          </div>
      </nav>
      <nav className="f-f-l relative z-10">
          <div className="relative z-10 mx-auto container hidden w-full px-4 xl:px-0 lg:flex justify-between items-center py-11">
            <div>
                <img
                  src="https://svgur.com/i/mXJ.svg"
                  alt="logo"
                  />
            </div>
            <div className="flex items-center text-white text-base font-medium">
                <ul className="flex items-center pr-3 xl:pr-12">
                  <li className="cursor-pointer hover:text-gray-300 ease-in">
                      <a
                        href="#home"
                        className="focus:outline-none focus:ring-2 focus:ring-white"
                        >
                      Home
                      </a>
                  </li>
                  <li className="pl-3 lg:pl-5 xl:pl-8 cursor-pointer hover:text-gray-300 ease-in">
                      <a
                        href="#about"
                        className="focus:outline-none focus:ring-2 focus:ring-white"
                        >
                      About
                      </a>
                  </li>
                  <li className="pl-3 lg:pl-5 xl:pl-8 cursor-pointer hover:text-gray-300 ease-in">
                      <a
                        href="#Donate"
                        className="focus:outline-none focus:ring-2 focus:ring-white"
                        >
                      Donate
                      </a>
                  </li>
                </ul>
                {address ? (
                <>
                <button onClick={disconnectWallet} className="px-6 py-3 bg-blue-400 hover:bg-blue-500 text-white text-base font-medium rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700">
                Disconnect
                </button>
                </>
                ) : (
                <button onClick={connectWithMetamask} className="px-6 py-3 bg-blue-400 hover:bg-blue-500 text-white text-base font-medium rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700">
                Connect Wallet
                </button>
                )}
            </div>
          </div>
      </nav>
          <div id="home" className="relative px-4 xl:px-0 container mx-auto md:flex items-center gap-8">
            <div className="text-color w-full md:w-1/3 pt-16 lg:pt-32 xl:pt-12">
                <h1 className="text-4xl md:text-4xl lg:text-6xl w-11/12 lg:w-11/12 xl:w-full xl:text-6xl text-gray-900 font-extrabold f-f-l">
                Mint NFTs and help those in need
                </h1>
                <div className="f-f-r text-base lg:text-base pb-20 sm:pb-0 pt-10 xl:pt-6">
                  <h2>             
                      Krainerous is not only a site where you can get NFTs, but also a crowdfunding program to help others!
                  </h2>
                </div>
                <div className="lg:flex">
                  <button className="hidden md:block hover:opacity-90 text-base w-full xl:text-base xl:w-6/12 mt-4 xl:mt-8 f-f-r py-4  bg-blue-700 text-white font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 rounded-lg">
                  <a href="#Donate">Donate Now!</a>
                  </button>
                </div>
            </div>
            <img
                className="w-full mt-8 md:mt-0 object-fill md:w-2/3 md:-ml-4 lg:-ml-4 xl:ml-0"
                src="https://i.ibb.co/SdJhGhW/Illustration-1.webp"
                alt="sample page"
                role="img"
                />
            <button className="md:hidden hover:opacity-90 text-base w-full xl:text-base xl:w-6/12 mt-4 xl:mt-8 f-f-r py-4  bg-blue-700 text-white font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 rounded-lg">
            <a href="#Donate">Donate Now!</a>
            </button>
          </div>
      </div>
      {/* ABOUT */}
      <div id="about" className="2xl:container 2xl:mx-auto lg:py-16 lg:px-20 md:py-12 md:px-6 py-9 px-4">
          <div className="lg:w-10/12 w-full">
            <p className="font-normal text-sm leading-3 text-blue-700 hover:text-blue-800 cursor-pointer">About</p>
            <h2 className="xl:w-8/12 lg:w-10/12 w-full font-bold text-gray-800 lg:text-4xl text-3xl lg:leading-10 leading-9 mt-2">We are here to raise funds to help Ukraine</h2>
            <p className="font-normal text-base leading-6 text-gray-600 mt-6">The war has been devastating for Ukrainians. Krainerous offers you to take part in helping Ukraine's families by minting NFTs. After you mint your NFTs, 
you will get your NFTs randomly. All of the earnings will be donated to Ukrainian people by using Unchain Ukraine. 
The funds will go a long way to support them as they fight for their freedom.</p>
          </div>
          <div className="lg:mt-14 sm:mt-10 mt-12">
            <img className="lg:block hidden w-full" src="https://i.ibb.co/bXBM6VK/Desktop-3.webp" alt="Group of people Chilling" />
            <img className="lg:hidden sm:block hidden w-full" src="https://i.ibb.co/bXBM6VK/Desktop-3.webp" alt="Group of people Chilling" />
            <img className="sm:hidden block w-full" src="https://i.ibb.co/bXBM6VK/Desktop-3.webp" alt="Group of people Chilling" />
          </div>
          <div className="lg:mt-16 sm:mt-12 mt-16 flex lg:flex-row justify-between flex-col lg:gap-8 gap-12">
            <div className="w-full xl:w-5/12 lg:w-6/12">
                <h2 className="font-bold lg:text-4xl text-3xl lg:leading-9 leading-7 text-gray-800">Start adding our NFTs to your collection</h2>
                <p className="font-normal text-base leading-6 text-gray-600 mt-4">While helping Ukrainians, you can also build up your exquisite NFTs collection... but there is a challenge for that to happen. Here in Krainerous, you will get your
NFTs randomly, means that you will get the common ones or the most valuable NFTs. Krainerous partners with various artists all around the world who are willing 
to support Ukrainians people by selling their arts.</p>
                <p className="font-normal text-base leading-6 text-gray-600 mt-6">Show them that they're not alone in this!</p>
            </div>
            <div className="lg:flex items-center w-full lg:w-1/2 ">
                <img className="lg:block hidden w-full" src="https://i.ibb.co/60b3ThS/Group-3.webp" alt="people discussing on board" />
                <img className="lg:hidden sm:block hidden w-full h-3/4" src="https://i.ibb.co/60b3ThS/Group-3.webp" alt="people discussing on board" />
                <img className="sm:hidden block w-full" src="https://i.ibb.co/60b3ThS/Group-3.webp" alt="people discussing on board" />
            </div>
          </div>
      </div>
      {/* MINTING */}
      <div id="Donate" className="bg-gray-100 overflow-y-hidden">
          <div className="mx-auto container py-12 px-4">
            <div className="w-full flex justify-center">
                <div className="w-full md:w-11/12 xl:w-10/12 bg-gradient-to-r from-blue-500 to-blue-700 md:py-8 md:px-8 px-5 py-4 xl:px-12 xl:py-16">
                  <div>
                      <div className="flex flex-wrap items-center md:flex-row flex-col-reverse">
                        <div className="md:w-2/3 w-full pb-6 md:pb-0 md:pr-6 flex-col md:block flex items-center justify-center md:pt-0 pt-4">
                            <div>
                              <h1 role="heading" className="text-xl md:text-2xl lg:text-4xl xl:text-4xl lg:w-10/12 text-white font-black leading-6 lg:leading-10 md:text-left text-center">We need you! Mint your NFTs now and be a part of our crowdfunding program!</h1>
                            </div>
                            <br/>
                            {/* Show claim button or connect wallet button */}
                            {address ? (
                            <>
                            <button onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1} type="button" className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">-</button> 
                            <button className="focus:outline-none text-black bg-blue-100 focus:ring-4 focus:ring-blue-100 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-100 dark:focus:ring-blue-800">{quantity}</button>
                            <button onClick={() => setQuantity(quantity + 1)} disabled={ quantity >= parseInt(activeClaimCondition?.quantityLimitPerTransaction || "0")} type="button" className="relative  focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">+</button>
                            <br/>
                            <button
                              className="mt-5 lg:mt-8 py-3 lg:py-4 px-4 lg:px-8 bg-white font-bold text-blue-700 rounded-lg text-sm lg:text-lg xl:text-xl hover:bg-opacity-90  focus:ring-2 focus:ring-offset-2 focus:ring-white focus:outline-none"
                              onClick={mint}
                              disabled={claimNFT.isLoading}
                              >
                            {claimNFT.isLoading ? "Minting..." : "Donate and Mint"}
                            </button>
                            </>
                            ) : (
                            <button className="mt-5 lg:mt-8 py-3 lg:py-4 px-4 lg:px-8 bg-white font-bold text-blue-700 rounded-lg text-sm lg:text-lg xl:text-xl hover:bg-opacity-90  focus:ring-2 focus:ring-offset-2 focus:ring-white focus:outline-none" onClick={connectWithMetamask}>
                            Connect Wallet
                            </button>
                            )}
                        </div>
                        <div className="md:w-1/3 w-2/3">
                            <img src="https://i.ibb.co/QYxgTjr/NFT.webp" alt="cartoon avatars" />
                        </div>
                      </div>
                  </div>
                </div>
            </div>
          </div>
      </div>
      {/*Footer*/}
      <div className="mx-auto container xl:px-20 lg:px-12 sm:px-6 px-4 px-4 py-12">
          <div className="flex flex-col items-center justify-center">
            <div>
                <img
                  src="https://svgur.com/i/mXJ.svg"
                  alt="logo"
                  />
            </div>
            <div className="flex items-center mt-6">
                <p className="text-base leading-4 text-gray-800">
                  2022 <span className="font-semibold">KRAINEROUS</span>
                </p>
                <div className="border-l border-gray-800 pl-2 ml-2">
                  <p className="text-base leading-4 text-gray-800">Inc. All rights reserved</p>
                </div>
            </div>
          </div>
      </div>
    </>
  );
};

export default Home;
