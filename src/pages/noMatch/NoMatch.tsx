const NoMatch = () =>{
    return (
        <div className="container text-center">
            <div className="row">
                <div className="col-12 my-3">
                    <h1 className="p-3 text-info-emphasis bg-info-subtle border border-info-subtle rounded-3">
                        404 - Not Found
                    </h1>
                </div>
                <div className="col-12">
                    <img src="src/assets/pengin.jpg" className="img-fluid w-25 mt-5" alt="dead pengin" />
                </div>
            </div>

        </div>
    )
}

export default NoMatch;