export const showRandomAd = () => {
    const RANDOM_AD = [-1, 0, 1];
    const randomNumber = Math.floor(Math.random() * RANDOM_AD.length);
    return RANDOM_AD[randomNumber] === 0
}