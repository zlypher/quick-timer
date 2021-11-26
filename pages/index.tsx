import { Button } from "@chakra-ui/button";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Box, Flex, Grid, Heading, Text, VStack } from "@chakra-ui/layout";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

type EventStatus = "stopped" | "playing";

interface IEvent {
  id: number;
  status: EventStatus;
  name: string;
  duration: number;
}

const withStatus = (events: IEvent[], status: EventStatus): IEvent[] => {
  return events.map((e) => {
    return { ...e, status };
  });
};

const formatTime = (duration: number): string => {
  const ms = duration % 1000;
  const seconds = Math.floor((duration % 60000) / 1000);
  const minutes = Math.floor(duration / 60000);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export default function Home() {
  const [name, setName] = useState<string>("");
  const [events, setEvents] = useState<IEvent[]>([]);
  // const [current, setCurrent] = useState();
  const selectedEvent = useRef<IEvent>();
  selectedEvent.current = events.find((e) => e.status === "playing");

  const prevTimeRef = useRef<number>();
  const rafRef = useRef<number>();
  useEffect(() => {
    rafRef.current = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const updateTime: FrameRequestCallback = (time) => {
    if (prevTimeRef != undefined && selectedEvent.current != null) {
      const delta = time - prevTimeRef.current;

      setEvents((oldEvents) => {
        const eIdx = oldEvents.findIndex(
          (event) => event.id === selectedEvent.current.id
        );
        const e = oldEvents[eIdx];
        return [
          ...oldEvents.slice(0, eIdx),
          {
            ...selectedEvent.current,
            duration: e.duration + delta,
          },
          ...oldEvents.slice(eIdx + 1, oldEvents.length),
        ];
      });
    }

    prevTimeRef.current = time;
    rafRef.current = requestAnimationFrame(updateTime);
  };

  const onCreateNewEvent = () => {
    if (name?.trim() === "") {
      return;
    }

    setEvents([
      ...events,
      {
        id: events.length + 1,
        name: name,
        status: "stopped",
        duration: 0,
      },
    ]);
    setName("");
  };

  const onPlay = (eventToPlay) => {
    const eIdx = events.findIndex((event) => event.id === eventToPlay.id);
    setEvents([
      ...withStatus(events.slice(0, eIdx), "stopped"),
      {
        ...eventToPlay,
        status: "playing",
      },
      ...withStatus(events.slice(eIdx + 1, events.length), "stopped"),
    ]);
  };

  const onStop = () => {
    setEvents([...withStatus(events, "stopped")]);
  };

  const onDelete = (eventToDelete) => {
    setEvents([...events.filter((e) => e.id !== eventToDelete.id)]);
  };

  return (
    <Box background="gray.50" minH="100vh">
      <Head>
        <title>Quick Timer</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex maxW="100%" p="8" w="1024px" m="0 auto" flexDir="column">
        <Grid mb="8" templateColumns={["1fr", "1fr 1fr"]} gap="4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onCreateNewEvent();
              return false;
            }}
          >
            <InputGroup size="lg">
              <Input
                pr="4.5rem"
                placeholder="Event"
                value={name}
                background="white"
                onChange={(e) => setName(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="md"
                  onClick={onCreateNewEvent}
                  disabled={name?.trim() === ""}
                >
                  Go
                </Button>
              </InputRightElement>
            </InputGroup>
          </form>
          <Flex>
            <Text>Current:</Text>
            {selectedEvent.current != null ? (
              <Text>{selectedEvent.current.name}</Text>
            ) : (
              <Text>-</Text>
            )}
          </Flex>
        </Grid>
        <Box mb="8">
          <Text fontSize="4xl" textAlign="center">
            {selectedEvent.current
              ? formatTime(selectedEvent.current.duration)
              : "00:00"}
          </Text>
        </Box>
        <Box>
          <Grid
            gap="4"
            templateColumns={"repeat( auto-fill, minmax(250px, 1fr) );"}
          >
            {events.map((e) => (
              <SingleEvent
                key={e.id}
                {...e}
                onPlay={() => onPlay(e)}
                onStop={onStop}
                onDelete={() => onDelete(e)}
              />
            ))}
          </Grid>
        </Box>
      </Flex>
    </Box>
  );
}

const SingleEvent = ({
  id,
  name,
  duration,
  status,
  onPlay,
  onStop,
  onDelete,
}) => (
  <Flex
    shadow="md"
    p="4"
    flexDir="column"
    background="blue.50"
    borderRadius="4px"
  >
    <Heading as="h3" textAlign="center" mb="4" size="lg">
      {name}
    </Heading>
    <Text size="md" textAlign="center" mb="4">
      {formatTime(duration)}
    </Text>
    <Flex flexWrap="wrap">
      <Button
        size="sm"
        disabled={status === "playing"}
        onClick={onPlay}
        colorScheme="blue"
      >
        Play
      </Button>
      <Button
        ml="2"
        size="sm"
        disabled={status === "stopped"}
        onClick={onStop}
        colorScheme="blue"
      >
        Stop
      </Button>
      <Button
        ml="auto"
        size="sm"
        disabled={status === "playing"}
        onClick={onDelete}
        colorScheme="red"
        variant="outline"
      >
        Delete
      </Button>
    </Flex>
  </Flex>
);