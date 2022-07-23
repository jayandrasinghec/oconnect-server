const tokenError = function (err: any) {
    return this.json({
        status:403,
        error:err,
        message:'TokenError : Not able to validate token'
    })
}
export default tokenError