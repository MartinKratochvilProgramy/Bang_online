export default function getRoleDescription(role) {
    if (role === "Sheriff") {
        return "Kill all the Bandits and the Renegade!"
    }

    if (role === "Bandit") {
        return "Kill the Sheriff!"
    }

    if (role === "Renegade") {
        return "Be the last one in play!"
    }

    if (role === "Vice") {
        return "Protect the sheriff! Kill all the outlaws and the renegade!"
    }
}