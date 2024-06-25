import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles";

export default function Navbar() {
    return (
        <nav style={styles.navbar}>
            <ul>
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/consortia">Consortia</Link>
                </li>
                <li>
                    <Link to="/computations">Computations</Link>
                </li>
                <li>
                    <Link to="/runs">Runs</Link>
                </li>
            </ul>
        </nav>
    );
}