module Main exposing (main)

import Browser
import Browser.Navigation exposing (Key)
import Html
import Json.Decode exposing (Value)
import Url exposing (Url)

type alias Model
    = Int

type Msg
    = Stub

init: Value -> Url -> Key -> ( Model, Cmd msg )
init flags url navkey =
    (0, Cmd.none)

onUrlChange url =
    Stub

onUrlRequest urlrequest =
    Stub

subscriptions model =
    Sub.none

update msg model =
    ( model, Cmd.none )

view model =
    { title = "Hello World"
    , body = [ Html.text "HELLO WORLD" ]
    }

main = 
    Browser.application
        { init = init
        , onUrlChange = onUrlChange
        , onUrlRequest = onUrlRequest
        , subscriptions = subscriptions
        , update = update
        , view = view
        }
