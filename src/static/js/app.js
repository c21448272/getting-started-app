function App() {
    const { Container, Row, Col } = ReactBootstrap;
    return (
        <Container>
            <Row>
                <Col md={{ offset: 3, span: 6 }}>
                    <TodoListCard />
                </Col>
            </Row>
        </Container>
    );
}

function TodoListCard() {
    const [items, setItems] = React.useState(null);
    const [completedItems, setCompletedItems] = React.useState([]);
    const [incompletedItems, setIncompletedItems] = React.useState([]);

    React.useEffect(() => {
        fetch('/items')
            .then(r => r.json())
            .then(data => {
                setItems(data);
                // Filter and set completed and incompleted items
                setCompletedItems(data.filter(item => item.completed));
                setIncompletedItems(data.filter(item => !item.completed));
            });
    }, []);

    const onNewItem = React.useCallback(
        newItem => {
            setItems([...items, newItem]);
            if (newItem.completed) {
                setCompletedItems([...completedItems, newItem]);
            } else {
                setIncompletedItems([...incompletedItems, newItem]);
            }
        },
        [items, completedItems, incompletedItems]
    );

    const onItemUpdate = React.useCallback(
    item => {
        const updatedItems = [...items];
        const updatedCompletedItems = [...completedItems];
        const updatedIncompletedItems = [...incompletedItems];
        const index = items.findIndex(i => i._id === item._id);

        updatedItems[index] = item;

        if (item.completed) {
            updatedCompletedItems.push(item);
            updatedIncompletedItems = incompletedItems.filter(i => i._id !== item._id);
        } else {
            updatedIncompletedItems.push(item);
            updatedCompletedItems = completedItems.filter(i => i._id !== item._id);
        }

        setItems(updatedItems);
        setCompletedItems(updatedCompletedItems);
        setIncompletedItems(updatedIncompletedItems);
    },
    [items, completedItems, incompletedItems]
);


  const onItemRemoval = React.useCallback(
    item => {
        // Remove the item from the items list
        setItems(items.filter(i => i.id !== item.id));

        // Update completedItems and incompletedItems based on the deleted item
        if (item.completed) {
            setCompletedItems(completedItems.filter(i => i.id !== item.id));
        } else {
            setIncompletedItems(incompletedItems.filter(i => i.id !== item.id));
        }
    },
    [items, completedItems, incompletedItems]
);


    if (items === null) return 'Loading...';

    return (
        <React.Fragment>
            <AddItemForm onNewItem={onNewItem} />
            {incompletedItems.length === 0 && completedItems.length === 0 && (
                <p className="text-center">No items yet! Add one above!</p>
            )}
            {incompletedItems.length > 0 && (
                <div>
                    <h2>Incomplete Items</h2>
                    {incompletedItems.map(item => (
                        <ItemDisplay
                            item={item}
                            key={item.id}
                            onItemUpdate={onItemUpdate}
                            onItemRemoval={onItemRemoval}
                        />
                    )}
                </div>
            )}
            {completedItems.length > 0 && (
                <div>
                    <h2>Completed Items</h2>
                    {completedItems.map(item => (
                        <ItemDisplay
                            item={item}
                            key={item.id}
                            onItemUpdate={onItemUpdate}
                            onItemRemoval={onItemRemoval}
                        />
                    )}
                </div>
            )}
        </React.Fragment>
    );
}


ReactDOM.render(<App />, document.getElementById('root'));
