export const respData = (data: any) => {
    return respJson(0, "ok", data || []);
};

export const respOk = () => {
    return respJson(0, "ok");
};

export const respErr = (message: string) => {
    return respJson(-1, message);
};

function respJson(code: number, message: string, data?: any) {
    let json = {
        code: code,
        message: message,
        data: data,
    };
    
    if (data) {
        json["data"] = data;
    }
    
    return Response.json(json);
}

export default respData;