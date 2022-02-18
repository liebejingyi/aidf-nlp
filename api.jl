using HTTP, JSON, Sockets
import HTTP.IOExtras.bytes

function add_headers(req::HTTP.Request, res::HTTP.Response)
    push!(res.headers, Pair("Access-Control-Allow-Origin", "*"))
    push!(res.headers, Pair("Access-Control-Allow-Methods", "GET,POST,OPTIONS"))
    push!(res.headers, Pair("Content-Type", "application/json,application/x-www-form-urlencoded"))
    return (req, res)
end

function set_status(req::HTTP.Request, res::HTTP.Response)
    res.status = 200
    return (req, res)
end

middleware = [add_headers, set_status]

function nlp_endpoint(req::HTTP.Request, res::HTTP.Response)
    # qparams = JSON.parse(String(req.body))
    qparams = JSON.parse(String(req.body))
    println(qparams)
    res.body = bytes(JSON.json(Dict("LDA"=>"test1","bert"=>"test2","error"=>false)))
    return (req, res)
end

function org_recommend_endpoint(req::HTTP.Request, res::HTTP.Response)
    # qparams = JSON.parse(String(req.body))
    qparams = JSON.parse(String(req.body))
    println(qparams)
    if qparams["language"] == 1
        textInput = [qparams["textInput"][1:50],qparams["textInput"][100:155]]
    else
        textInput = [qparams["textInput"][30:80]]
    end
    org = JSON.json(Dict("org"=>textInput,"language"=>"English","error"=>false))

    res.body = bytes(org)
    return (req, res)
end

function str2symbolDict(d::Dict)
    return Dict(Symbol(k) => v for (k, v) in d)
end

function stack(layers)
    return function(req::HTTP.Request)
        res = HTTP.Response()
        for l in layers
            println(typeof(l))
            (req, res) = l(req, res)
        end
        return res
    end
end



router = HTTP.Router()

HTTP.register!(router, "POST", "/nlp_combined", stack([middleware..., nlp_endpoint]))
HTTP.register!(router, "POST", "/org_recommend", stack([middleware..., org_recommend_endpoint]))

@info("Start Server...")
# saveIPAddress()
HTTP.serve(router, getipaddr(), 9100; verbose=false, rate_limit=Int(10)//Int(1))
