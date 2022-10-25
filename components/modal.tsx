/* eslint-disable @next/next/no-img-element */
import { useState } from "react"
import { addDotsForLongAddr } from "../pages/community/[id]"
import Icon from "./icon"

export default function NFTModal({ onClosePopup, onPressMint,address }) {
    return (
        <div className="nft-modal">
            <div className="nft-modal-container">
                <div className="nft-modal-header">
                    <button className="close-modal" onClick={onClosePopup}><Icon n="close" /></button>
                </div>
                <img
                    src="https://i.imgur.com/seB1iJo.png"
                    alt="Nouns"
                />
                <p>
                    🎉 Click Mint to claim your reward {addDotsForLongAddr(address)}
                </p>
                <button onClick={onPressMint} className="nft-mint">Mint</button>
            </div>
        </div>
    )
}