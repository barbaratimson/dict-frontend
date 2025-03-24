import * as React from 'react';
import styled from "styled-components";
import {TextLarge, TextMedium, TextSmall} from "../../styles/components";
import {theme} from "../../styles/theme";
import {useNavigate} from "react-router-dom";


const SidebarWrapper = styled.div`
  padding: 20px;
  height: 100%;
  background-color: ${theme.colors.primary};
`

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`

const Sidebar = () => {
    const navigate = useNavigate()
    return (
        <SidebarWrapper>
            <SidebarContent>
                <TextLarge onClick={() => {
                    navigate("/")
                }}>Dictionary</TextLarge>
                <TextSmall onClick={() => {
                    navigate("/user")
                }}>Your Dictionary</TextSmall>
                <TextSmall onClick={() => {
                    navigate("/words")
                }}>Words</TextSmall>
            </SidebarContent>
        </SidebarWrapper>
    );
}
export default Sidebar;