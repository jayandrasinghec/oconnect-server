const apiError = function (err: any) {
    return this.json({
        status:500,
        error: err,
        message:'There was an error in the API'
    })
}

export default apiError;