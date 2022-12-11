from app import database, crud, schemas

import time

KEY = 'refund_order'
GROUP = 'payment_group'


def process_request(fields: dict) -> schemas.OrderIn:
    order_id = fields.get('order_id')

    print('order_id:', order_id)

    updated_order = schemas.OrderIn(
        id=order_id,
        status='refunded'
    )

    return updated_order


def main():
    if database.redis.exists(KEY) == 0:
        database.redis.xgroup_create(name=KEY, groupname=GROUP, mkstream=True)

    while True:
        time.sleep(1)

        results = database.redis.xreadgroup(groupname=GROUP, consumername=KEY, streams={KEY: '>'})  # '>' - all events

        print('results:', results)

        if not results:
            continue

        for result in results:
            fields = result[1][0][1]
            updated_order = process_request(fields)

            if updated_order is not None:
                crud.update_order(session=next(database.get_session()), updated_order=updated_order)


if __name__ == '__main__':
    main()
