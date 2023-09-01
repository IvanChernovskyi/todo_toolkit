import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import { fetchTodos, setFetchedTodos } from './redux/todosSlice';
import { setModal } from './redux/modalSlice';
import {
  reorder,
  move,
  getItemStyle,
  getListStyle,
} from './components/dragHelpers';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  background: '#ccc',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const App = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);
  const modal = useSelector((state) => state.modal);
  const loading = useSelector((state) => state.loading);

  const [state, setState] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchTodos()).then((action) => {
      if (fetchTodos.fulfilled.match(action)) {
        dispatch(setFetchedTodos(action.payload));
      }
    });
    setState([
      ...todos,
      [
        {
          id: 11,
          title: '11',
        },
      ],
      [
        {
          id: 12,
          title: '12',
        },
      ],
    ]);
  }, [dispatch, todos.length]);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination, state);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState.filter((group) => group?.length));
    }
  };

  const handleModal = (idx, text) => {
    console.log(idx);
    setDeleteId(idx);
    dispatch(setModal(!modal));

    if (deleteId && text === 'delete') {
      const newState = [...state];
      newState[1]?.splice(deleteId, 1);
      setState(newState.filter((group) => group.length));
    }
  };

  const handleDeleteItemsInList = () => {
    const newState = [...state];
    newState?.splice(2, 1);
    return setState(newState);
  };
  const handleCreateNewList = () => {
    const newState = [...state, [{ id: Math.random(), title: 'modal' }]];
    return setState(newState);
  };

  if (loading) return <p>Loading...</p>;

  console.log('state', state);

  return (
    <div>
      <Modal
        open={modal}
        onClose={handleModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are u sure wants delete this item?
          </Typography>

          <Button type="button" onClick={(e) => handleModal(e, 'close')}>
            close
          </Button>
          <Button type="button" onClick={(e) => handleModal(e, 'delete')}>
            delete
          </Button>
        </Box>
      </Modal>
      <div style={{ display: 'flex' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {state.map((el, ind) => (
            <Droppable key={`${ind}`} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {el.map((item, index) => (
                    <Draggable
                      key={item?.id?.toString()}
                      draggableId={item?.id?.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-around',
                            }}
                          >
                            {item?.title}
                            {ind === 1 && (
                              <>
                                {state[1].length >= 2 && (
                                  <Button
                                    type="button"
                                    onClick={() => handleModal(index)}
                                  >
                                    delete
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
      <Button type="button" onClick={handleDeleteItemsInList}>
        delete all items in 3 list
      </Button>
      <Button type="button" onClick={handleCreateNewList}>
        create new list
      </Button>
    </div>
  );
};

export default App;
