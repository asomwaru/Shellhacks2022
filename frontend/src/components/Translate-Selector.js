import React, { Component, useState } from "react";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
var language = "english"

class SelectorContainer extends Component{
    render(){
        return(
            <div>
                <p className="text-white">Choose a language</p>
                <Dropdown options={options} onChange={this._onSelect} value={'English'} placeholder="Select an option" />;
            </div>

        )
        }
}

const options = [
    "af",
    "ar",
    "bn",
    "bg",
    "ca",
    "yue",
    "cs",
    "da",
    "nl",
    "en",
    "fil",
    "fi",
    "fr",
    "de",
    "el",
    "gu",
    "hi",
    "hu",
    "is",
    "id",
    "it",
    "ja",
    "kn",
    "ko",
    "lv",
    "ms",
    "ml",
    "cmn",
    "nb",
    "pl",
    "pt",
    "pa",
    "ro",
    "ru",
    "sr",
    "sk",
    "es",
    "sv",
    "ta",
    "te",
    "th",
    "tr",
    "ukr",
    "vi"
  ];
export {
    SelectorContainer
}