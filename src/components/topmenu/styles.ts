/**
 * IMPORTS
 */
import { Button } from "components/button";
import { Input } from "components/form/input";
import styled from "styled-components";
import { devices } from "styles/devices";

export const $TopMenuContainer = styled.header`
    position: sticky;
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 80px;
    background-color: ${props => props.theme.neutral2}70;
    top: 0;
    z-index: 3;
    padding: 0;

    @media ${devices.tablet}{
        height: 60px;
    }
`

export const $TopMenuContent = styled.div`
    display: flex;
    flex-grow: 1;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: auto;
    padding: 0 200px;

    .logoLink {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    @media (max-width: 965px){
        padding: 0 100px;
    }

    @media ${devices.tablet}{
        padding: 0 20px;
    }
`

export const $TopMenuOptions = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media ${devices.tablet}{
        display: none;
    }
`

export const $Logo = styled.img`
    height: 70px;

    @media ${devices.tablet}{
        height: 50px;
    }
`

export const $MenuButton = styled(Button)`
    background: transparent;
    border-radius: 50%;
    color: ${props => props.theme.neutral8};
    width: 50px;
    height: 50px;
    padding: 8px;

    &:hover{
        background: ${props => props.theme.neutral4}50;
    }

    svg{
        height: 100%;
        width: 100%;
    }
`

export const $MenuOption = styled($MenuButton)`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    padding: 0 8px;
    height: auto;
    width: auto;

    &.mobileOption {
        display: none;
        
        @media ${devices.tablet} {
            display: flex;
        }
    }
    
    svg{
        padding: 8px 0;
        width: 40px;
        height: 40px;
    }
    p{
        font-size: 14px;
        text-transform: none;
    }

    p, svg{
        color: ${props => props.theme.neutral7};
    }
`

export const $SearchField = styled.div`
    width: 30%;
    div{
        width: 100%;
    }
`