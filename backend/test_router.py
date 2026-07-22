from backend.main import app

def get_routes(app):
    return app.openapi()["paths"]
    return {
        str(route) #(route.path, method)
        for route in app.routes
        #if hasattr(route, "methods")
        #for method in route.methods
    }

for x in get_routes(app):
    print(x)
    print()


