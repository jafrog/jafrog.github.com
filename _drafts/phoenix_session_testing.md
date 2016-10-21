I tried to send a session with a request. Like this:

```elixir
  @session Plug.Session.init(
    [
      store: :cookie,
      key: "foobar",
      encryption_salt: "encrypted cookie salt",
      signing_salt: "signing salt",
      log: false
    ])
  test "shows user name if user is logged in", %{conn: conn} do
    conn = conn()
           |> Map.put(:secret_key_base, String.duplicate("abcdefgh", 8))
           |> Plug.Session.call(@session)
           |> fetch_session
           |> put_session(:current_user, "Toothless")
           |> se

    conn = get conn, user_path(conn, :show)
```

It doesn't work because `get conn, path` resets the session. If we look at the examples from https://github.com/elixir-lang/plug/blob/master/test/plug/session/cookie_test.exs#L121-L125

```elixir
defp sign_conn(conn, secret \\ @secret) do
  put_in(conn.secret_key_base, secret)
  |> Plug.Session.call(@signing_opts)
  |> fetch_session
end

conn = conn(:get, "/")
       |> sign_conn()
       |> put_session("foo", "bar")
       |> configure_session(drop: true)
       |> send_resp(200, "")"")
```

We don't use `Phoenix.ConnTest.dispatch`, we explicitly send a response. But I need to test this:

```elixir
def show(conn, _params) do
  user = get_session(conn, :current_user)
  if user do
    render(conn, "show.html", user: user)
  else
    redirect(conn, to: session_path(conn, :login))
  end
end
```

So it doesn't work. What we can do instead is define an `Authenticate` module, unit test it separately and then mock it in controller tests like advised here - http://blog.plataformatec.com.br/2015/10/mocks-and-explicit-contracts/
