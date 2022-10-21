export const pauseExecution = (milliseconds: number) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds))
}