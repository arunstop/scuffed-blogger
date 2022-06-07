import React from "react";
import { MainModalProps } from "../../utils/data/Main";
import MainSearchBar from "./MainSearchBar";
import ModalTemplate from "./ModalTemplate";

const SearchModal = React.memo(function SearchModal(props: MainModalProps) {
  return (
    <ModalTemplate {...props} title="Search Tuturku" fullscreen>
      
        <MainSearchBar />
      
    </ModalTemplate>
  );
});

export default SearchModal;
