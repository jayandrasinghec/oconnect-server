const forbidden = function (err: any) {
    return this.json({
        status:403,
        error:err,
        message:'Forbidden : Permission Denied'
    })
}
export default forbidden;