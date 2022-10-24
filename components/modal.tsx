import { useState } from "react"
import Icon from "./icon"

export default function NFTModal({ onClosePopup, children }) {
    return (
        <div className="nft-modal">
            <div>
                <button onClick={onClosePopup}><Icon n="close" /></button>
                <hr />
                {children}
            </div>
        </div>
    )
}